import { VectorStoreIndex } from "llamaindex";
import { storageContextFromDefaults } from "llamaindex/storage/StorageContext";
import { BlobServiceClient } from "@azure/storage-blob"; // ✅ Azure Blob SDK
import * as fs from "fs/promises"; // ✅ FileSystem promises
import * as path from "path"; // ✅ Node.js path helper
import * as dotenv from "dotenv";

import { getDocuments } from "./loader";
import { initSettings } from "./settings";

// Load environment variables from local .env file
dotenv.config();

async function getRuntime(func: any) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}

async function uploadStorageToBlob(persistDir: string) {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "llama-index-data";
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  await containerClient.createIfNotExists(); // Make sure container exists

  const files = await fs.readdir(persistDir);
  for (const file of files) {
    const filePath = path.join(persistDir, file);
    const blockBlobClient = containerClient.getBlockBlobClient(file);
    const fileContent = await fs.readFile(filePath);
    await blockBlobClient.upload(fileContent, fileContent.length);
    console.log(`Uploaded ${file} to blob storage`);
  }
}

async function generateDatasource() {
  console.log(`Generating storage context...`);
  const persistDir = process.env.STORAGE_CACHE_DIR;
  if (!persistDir) {
    throw new Error("STORAGE_CACHE_DIR environment variable is required!");
  }
  const ms = await getRuntime(async () => {
    const storageContext = await storageContextFromDefaults({ persistDir });
    const documents = await getDocuments();
    await VectorStoreIndex.fromDocuments(documents, { storageContext });
    await uploadStorageToBlob(persistDir);
  });
  console.log(`Storage context successfully generated and uploaded in ${ms / 1000}s.`);
}

(async () => {
  initSettings();
  await generateDatasource();
  console.log("Finished generating storage.");
})();
