/**
 * Placeholder AI/OCR provider client.
 * Swap the body of `extractDocumentData` for a real Vision/OCR API integration
 * once a provider is selected per docs/tech-spec.md §1.2 Technology Stack.
 */

export interface ExtractResult {
  data: Record<string, string>;
  confidence: number;
}

export async function extractDocumentData(filePath: string): Promise<ExtractResult> {
  // TODO: replace with a real call to the AI/OCR provider, passing a signed
  // Storage URL for `filePath` and mapping its response into `data`.
  void filePath;
  return {
    data: {
      full_name: "",
      id_number: "",
      issue_date: "",
      expiry_date: "",
    },
    confidence: 0,
  };
}
