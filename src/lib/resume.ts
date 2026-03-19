import { PDFParse } from "pdf-parse";
import { ParsedResume } from "./types";
import { parseResumeWithClaude } from "./anthropic";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text || result.pages.map((p: { text: string }) => p.text).join("\n");
}

export async function parseResume(pdfBuffer: Buffer): Promise<ParsedResume> {
  const text = await extractTextFromPDF(pdfBuffer);
  return parseResumeWithClaude(text);
}
