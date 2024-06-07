targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

param llamaIndexNextjsExists bool
@secure()
param llamaIndexNextjsDefinition object

@description('Id of the user or app to assign application roles')
param principalId string

param openAiLocation string // Set in main.parameters.json
param openAiSkuName string = 'S0' // Set in main.parameters.json
param openAiUrl string = '' // Set in main.parameters.json
param openAiApiVersion string // Set in main.parameters.json

var finalOpenAiUrl = empty(openAiUrl) ? 'https://${openAi.outputs.name}.openai.azure.com' : openAiUrl

var azureOpenAIConfig = {
  modelName: 'gpt-35-turbo'
  deploymentName: 'gpt-35-turbo'
  deploymentVersion: '1106'
  deploymentCapacity: 10
}

var llamaIndexConfig = {
  model_provider: 'openai'
  model: 'gpt-35-turbo' // openai: gpt-35-turbo | azureopenai: gpt-35-turbo
  embedding_model: 'text-embedding-3-large'
  embedding_dim: 1024
  openai_api_key: ''
  llm_temperature: '0.7'
  llm_max_tokens: 100
  top_k: 3
  fileserver_url_prefix: 'http://localhost/api/files'
  system_prompt: 'You are a helpful assistant who helps users with their questions.'
}

// Tags that should be applied to all resources.
// 
// Note that 'azd-service-name' tags should be applied separately to service host resources.
// Example usage:
//   tags: union(tags, { 'azd-service-name': <service name in azure.yaml> })
var tags = {
  'azd-env-name': environmentName
}

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module monitoring './shared/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
  scope: rg
}

module dashboard './shared/dashboard-web.bicep' = {
  name: 'dashboard'
  params: {
    name: '${abbrs.portalDashboards}${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    location: location
    tags: tags
  }
  scope: rg
}

module registry './shared/registry.bicep' = {
  name: 'registry'
  params: {
    location: location
    tags: tags
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  }
  scope: rg
}

module keyVault './shared/keyvault.bicep' = {
  name: 'keyvault'
  params: {
    location: location
    tags: tags
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    principalId: principalId
  }
  scope: rg
}

module appsEnv './shared/apps-env.bicep' = {
  name: 'apps-env'
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
  scope: rg
}

module openAi './shared/cognitiveservices.bicep' = if (empty(openAiUrl)) {
  name: 'openai'
  scope: rg
  params: {
    name: '${abbrs.cognitiveServicesAccounts}${resourceToken}'
    location: openAiLocation
    tags: tags
    sku: {
      name: openAiSkuName
    }
    disableLocalAuth: true
    deployments: [
      {
        name: azureOpenAIConfig.deploymentName
        model: {
          format: 'OpenAI'
          name: azureOpenAIConfig.modelName
          version: azureOpenAIConfig.deploymentVersion
        }
        sku: {
          name: 'Standard'
          capacity: azureOpenAIConfig.deploymentCapacity
        }
      }
    ]
  }
}

// Roles

// User roles
module openAiRoleUser './shared/role.bicep' = {
  scope: rg
  name: 'openai-role-user'
  params: {
    principalId: principalId
    // Cognitive Services OpenAI Contributor
    roleDefinitionId: 'a001fd3d-188f-4b5d-821b-7da978bf7442'
    principalType: 'User'
  }
}

// System roles
module openAiRoleApi './shared/role.bicep' = {
  scope: rg
  name: 'openai-role-api'
  params: {
    principalId: openAi.outputs.identityPrincipalId
    // Cognitive Services OpenAI Contributor
    roleDefinitionId: 'a001fd3d-188f-4b5d-821b-7da978bf7442'
    principalType: 'ServicePrincipal'
  }
}

module llamaIndexNextjs './app/llama-index-nextjs.bicep' = {
  name: 'llama-index-nextjs'
  params: {
    name: '${abbrs.appContainerApps}llama-index-${resourceToken}'
    location: location
    tags: tags
    identityName: '${abbrs.managedIdentityUserAssignedIdentities}llama-index-${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    containerAppsEnvironmentName: appsEnv.outputs.name
    containerRegistryName: registry.outputs.name
    exists: llamaIndexNextjsExists
    appDefinition: union(llamaIndexNextjsDefinition, {
      AZURE_KEY_VAULT_NAME: keyVault.outputs.name
      AZURE_KEY_VAULT_ENDPOINT: keyVault.outputs.endpoint

      AZURE_OPENAI_ENDPOINT: finalOpenAiUrl
      AZURE_DEPLOYMENT_NAME: azureOpenAIConfig.deploymentName
      OPENAI_API_VERSION: openAiApiVersion

      MODEL_PROVIDER: llamaIndexConfig.model_provider
      MODEL: llamaIndexConfig.model
      EMBEDDING_MODEL: llamaIndexConfig.embedding_model
      EMBEDDING_DIM: llamaIndexConfig.embedding_dim
      OPENAI_API_KEY: llamaIndexConfig.openai_api_key
      LLM_TEMPERATURE: llamaIndexConfig.llm_temperature
      LLM_MAX_TOKENS: llamaIndexConfig.llm_max_tokens
      TOP_K: llamaIndexConfig.top_k
      FILESERVER_URL_PREFIX: llamaIndexConfig.fileserver_url_prefix
      SYSTEM_PROMPT: llamaIndexConfig.system_prompt
    })
  }
  scope: rg
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = registry.outputs.loginServer
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint

output AZURE_OPENAI_ENDPOINT string = finalOpenAiUrl
output AZURE_DEPLOYMENT_NAME string = azureOpenAIConfig.deploymentName
output OPENAI_API_VERSION string = openAiApiVersion

//  LlamaIndex configuration
output MODEL_PROVIDER string = llamaIndexConfig.model_provider
output MODEL string = llamaIndexConfig.model
output EMBEDDING_MODEL string = llamaIndexConfig.embedding_model
output EMBEDDING_DIM int = llamaIndexConfig.embedding_dim
output OPENAI_API_KEY string = llamaIndexConfig.openai_api_key
output LLM_TEMPERATURE string = llamaIndexConfig.llm_temperature
output LLM_MAX_TOKENS int = llamaIndexConfig.llm_max_tokens
output TOP_K int = llamaIndexConfig.top_k
output FILESERVER_URL_PREFIX string = llamaIndexConfig.fileserver_url_prefix
output SYSTEM_PROMPT string = llamaIndexConfig.system_prompt
