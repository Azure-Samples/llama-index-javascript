import { OpenAI, OpenAIEmbedding, Settings } from "llamaindex";

import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import { OllamaEmbedding } from "llamaindex/embeddings/OllamaEmbedding";
import { Ollama } from "llamaindex/llm/ollama";

const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 20;
const AZURE_COGNITIVE_SERVICES_SCOPE =
  "https://cognitiveservices.azure.com/.default";

export const initSettings = async () => {
  console.log(`Using '${process.env.MODEL_PROVIDER}' model provider`);

  // if provider is OpenAI, MODEL must be set
  if (process.env.MODEL_PROVIDER === 'openai' && process.env.OPENAI_API_TYPE !== 'AzureOpenAI' && !process.env.MODEL) {
    throw new Error("'MODEL' env variable must be set.");
  }

  // if provider is Azure OpenAI, AZURE_DEPLOYMENT_NAME must be set
  if (process.env.MODEL_PROVIDER === 'openai' && process.env.OPENAI_API_TYPE === 'AzureOpenAI' && !process.env.AZURE_DEPLOYMENT_NAME) {
    throw new Error("'AZURE_DEPLOYMENT_NAME' env variables must be set.");
  }

  if (!process.env.EMBEDDING_MODEL) {
    throw new Error("'EMBEDDING_MODEL' env variable must be set.");
  }

  switch (process.env.MODEL_PROVIDER) {
    case "ollama":
      initOllama();
      break;
    case "openai":
      if (process.env.OPENAI_API_TYPE === "AzureOpenAI") {
        await initAzureOpenAI();
      } else {
        initOpenAI();
      }
      break;
    default:
      throw new Error(
        `Model provider '${process.env.MODEL_PROVIDER}' not supported.`,
      );
  }
  Settings.chunkSize = CHUNK_SIZE;
  Settings.chunkOverlap = CHUNK_OVERLAP;
};

function initOpenAI() {
  Settings.llm = new OpenAI({
    model: process.env.MODEL ?? "gpt-3.5-turbo",
    maxTokens: 512,
  });
  Settings.embedModel = new OpenAIEmbedding({
    model: process.env.EMBEDDING_MODEL,
    dimensions: process.env.EMBEDDING_DIM
      ? parseInt(process.env.EMBEDDING_DIM)
      : undefined,
  });
}

async function initAzureOpenAI() {
  const credential = new DefaultAzureCredential();
  const azureADTokenProvider = getBearerTokenProvider(
    credential,
    AZURE_COGNITIVE_SERVICES_SCOPE,
  );

  const azure = {
    azureADTokenProvider,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-35-turbo",
  };

  // configure LLM model
  Settings.llm = new OpenAI({
    azure,
  }) as any;

  // configure embedding model
  azure.deployment = process.env.EMBEDDING_MODEL as string;
  Settings.embedModel = new OpenAIEmbedding({
    azure,
    model: process.env.EMBEDDING_MODEL,
    dimensions: process.env.EMBEDDING_DIM
      ? parseInt(process.env.EMBEDDING_DIM)
      : undefined,
  });
}

function initOllama() {
  const config = {
    host: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  };
  Settings.llm = new Ollama({
    model: process.env.MODEL ?? "",
    config,
  });
  Settings.embedModel = new OllamaEmbedding({
    model: process.env.EMBEDDING_MODEL ?? "",
    config,
  });
}

