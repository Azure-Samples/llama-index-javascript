import { BaseChatEngine, BaseToolWithCall, LLMAgent } from "llamaindex";
import fs from "node:fs/promises";
import path from "node:path";
import { getDataSource } from "./index";
import { createTools } from "./tools";
import { createQueryEngineTool } from "./tools/query-engine";
import { WebScraperTool } from "./tools/web-search"; // 👈 Import your tool

export async function createChatEngine(documentIds?: string[], params?: any) {
  const tools: BaseToolWithCall[] = [];

  // Add a query engine tool if we have a data source
  const index = await getDataSource(params);
  if (index) {
    tools.push(createQueryEngineTool(index, { documentIds }));
  }

  // Manually add WebScraperTool (no need for tools.json)
  tools.push(new WebScraperTool());

  // Optionally load tools from config if file exists
  const configFile = path.join("config", "tools.json");
  let toolConfig: any;
  try {
    // add tools from config file if it exists
    toolConfig = JSON.parse(await fs.readFile(configFile, "utf8"));
  } catch (e) {
    console.info(`Could not read ${configFile} file. Using no config tools.`);
  }

  if (toolConfig) {
    tools.push(...(await createTools(toolConfig)));
  }

  const agent = new LLMAgent({
    tools,
    systemPrompt: process.env.SYSTEM_PROMPT,
  }) as unknown as BaseChatEngine;

  return agent;
}
