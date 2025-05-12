import axios from "axios";
import { Document } from "@llamaindex/core/schema";

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || "http://localhost:5001/scrape";

export async function scrapeWebDocuments(urls: string[]): Promise<Document[]> {
  try {
    const response = await axios.post(SCRAPER_API_URL, { urls });

    if (!Array.isArray(response.data)) {
      console.warn("Unexpected response format from scraper:", response.data);
      return [];
    }

    return response.data.map((entry: any) => 
      new Document({
        text: entry.text,
        metadata: {
          source: entry.url || "web",
          private: "false",
        },
      })
    );
  } catch (error) {
    console.error("Error calling web scraper service:", error);
    return [];
  }
}
