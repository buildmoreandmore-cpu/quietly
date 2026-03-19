import { ParsedResume } from "./types";
import { parseResumeWithClaude } from "./anthropic";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const uint8 = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data: uint8, useSystemFonts: true }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: Record<string, unknown>) => (item as { str: string }).str)
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

export async function parseResume(pdfBuffer: Buffer): Promise<ParsedResume> {
  const text = await extractTextFromPDF(pdfBuffer);
  if (!text.trim()) {
    throw new Error("No text extracted from PDF");
  }
  return parseResumeWithClaude(text);
}
