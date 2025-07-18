
@description('The location used for all deployed resources')
param location string

@description('The name of the container app')
param name string

@description('The port the container app listens on')
param targetPort int = 3000

@description('The minimum number of replicas for the container app')
param scaleMinReplicas int = 1

@description('The maximum number of replicas for the container app')
param scaleMaxReplicas int = 10

@description('The container image to deploy')
param containerImage string

@description('The resource ID of the container apps environment')
param environmentResourceId string

@description('The resource ID of the user-assigned managed identity')
param userAssignedIdentityResourceId string

@description('The client ID of the user-assigned managed identity')
param userAssignedIdentityClientId string

@description('The login server of the container registry')
param containerRegistryLoginServer string

@description('The connection string for Application Insights')
param appInsightsConnectionString string

@description('The endpoint for Azure OpenAI')
param openAiEndpoint string

@description('The deployment name for Azure OpenAI')
param openAiDeploymentName string

@description('The API version for Azure OpenAI')
param openAiApiVersion string

@description('The model provider')
param modelProvider string

@description('The model name')
param model string

@description('The embedding model name')
param embeddingModel string

@description('The embedding dimension')
param embeddingDim string

@description('The LLM temperature')
param llmTemperature string

@description('The LLM max tokens')
param llmMaxTokens string

@description('The top K value')
param topK string

@description('The file server URL prefix')
param fileServerUrlPrefix string

@description('The system prompt')
param systemPrompt string

@description('Tags that will be applied to all resources')
param tags object = {}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityResourceId}': {}
    }
  }
  properties: {
    managedEnvironmentId: environmentResourceId
    configuration: {
      ingress: {
        external: true
        targetPort: targetPort
        transport: 'auto'
      }
      registries: [
        {
          server: containerRegistryLoginServer
          identity: userAssignedIdentityResourceId
        }
      ]
    }
    template: {
      containers: [
        {
          image: containerImage
          name: 'main'
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: appInsightsConnectionString
            }
            {
              name: 'AZURE_CLIENT_ID'
              value: userAssignedIdentityClientId
            }
            {
              name: 'PORT'
              value: '${targetPort}'
            }
            {
              name: 'AZURE_OPENAI_ENDPOINT'
              value: openAiEndpoint
            }
            {
              name: 'AZURE_DEPLOYMENT_NAME'
              value: openAiDeploymentName
            }
            {
              name: 'AZURE_OPENAI_API_VERSION'
              value: openAiApiVersion
            }
            {
              name: 'MODEL_PROVIDER'
              value: modelProvider
            }
            {
              name: 'MODEL'
              value: model
            }
            {
              name: 'EMBEDDING_MODEL'
              value: embeddingModel
            }
            {
              name: 'EMBEDDING_DIM'
              value: embeddingDim
            }
            {
              name: 'LLM_TEMPERATURE'
              value: llmTemperature
            }
            {
              name: 'LLM_MAX_TOKENS'
              value: llmMaxTokens
            }
            {
              name: 'TOP_K'
              value: topK
            }
            {
              name: 'FILESERVER_URL_PREFIX'
              value: fileServerUrlPrefix
            }
            {
              name: 'SYSTEM_PROMPT'
              value: systemPrompt
            }
            {
              name: 'OPENAI_API_TYPE'
              value: 'AzureOpenAI'
            }
            {
              name: 'STORAGE_CACHE_DIR'
              value: './cache'
            }
          ]
        }
      ]
      scale: {
        minReplicas: scaleMinReplicas
        maxReplicas: scaleMaxReplicas
      }
    }
  }
}

output resourceId string = containerApp.id
