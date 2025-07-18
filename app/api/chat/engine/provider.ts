import {
AzureOpenAI,
  AzureOpenAIEmbedding,
} from "@llamaindex/azure";

import { Settings } from "llamaindex";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

const AZURE_COGNITIVE_SERVICES_SCOPE =
  "https://cognitiveservices.azure.com/.default";

export function setupProvider() {
  const credential = new DefaultAzureCredential();
    const azureADTokenProvider = getBearerTokenProvider(
      credential,
      AZURE_COGNITIVE_SERVICES_SCOPE,
    );
  
    const azure = {
      azureADTokenProvider,
      deployment: process.env.AZURE_DEPLOYMENT_NAME ?? "gpt-35-turbo",
    };
  
    // configure LLM model
    Settings.llm = new AzureOpenAI({
      ...azure
    }) as any;
  
    // configure embedding model
    azure.deployment = process.env.EMBEDDING_MODEL as string;
    Settings.embedModel = new AzureOpenAIEmbedding({
      ...azure,
      model: process.env.EMBEDDING_MODEL,
      dimensions: process.env.EMBEDDING_DIM
        ? parseInt(process.env.EMBEDDING_DIM)
        : undefined,
    });
}
