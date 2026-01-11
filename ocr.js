import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import "dotenv/config";

const client = new DocumentAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

export async function runOCRBuffer(fileBuffer) {
  
  const poller = await client.beginAnalyzeDocument(
    "prebuilt-read",
    fileBuffer
  );

  const result = await poller.pollUntilDone();

  console.log("========== AZURE RAW OCR RESPONSE ==========");
  console.dir(result, { depth: null });
  console.log("===========================================");

  let pages = [];

  for (const page of result.pages) {
    let textBlock = "";

    if (page.lines) {
      for (const line of page.lines) {
        textBlock += line.content + "\n";
      }
    }

    pages.push({
      pageNumber: page.pageNumber,
      text: textBlock.trim()
    });
  }

  return pages;
}
