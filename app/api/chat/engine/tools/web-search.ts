import { BaseTool, ToolMetadata } from "llamaindex";
import { JSONSchemaType } from "ajv";
import { Document } from "@llamaindex/core/schema";
import { scrapeWebDocuments } from "./scraper";

type WebScraperParams = {
  urls: string[];
};

export class WebScraperTool implements BaseTool<WebScraperParams> {
  metadata: ToolMetadata<JSONSchemaType<WebScraperParams>> = {
    name: "web_scraper",
    description: "Scrape web page content from a list of URLs",
    parameters: {
      type: "object",
      properties: {
        urls: {
          type: "array",
          items: { type: "string" },
          description: "List of URLs to scrape",
        },
      },
      required: ["urls"],
    },
  };

  async call(input: WebScraperParams): Promise<string> {
    const docs: Document[] = await scrapeWebDocuments(input.urls);
    return docs.map((d) => d.text).join("\n---\n");
  }
}
