import { onCall } from "firebase-functions/v2/https";
import { requireAuth, requireField } from "../middleware/guards";
import { scanAndStoreDocument } from "../services/documentService";

interface ScanDocumentRequest {
  file_path: string; // Firebase Storage path, e.g. users/{uid}/documents/{id}.jpg
  doc_type: string; // e.g. "national_id"
}

/** Callable: runs AI/OCR extraction on an uploaded document and saves the result. */
export const scanDocument = onCall<ScanDocumentRequest>(async (request) => {
  const uid = requireAuth(request);
  const filePath = requireField(request.data.file_path, "file_path");
  const docType = requireField(request.data.doc_type, "doc_type");

  const result = await scanAndStoreDocument(uid, filePath, docType);

  return {
    document_id: result.documentId,
    extracted_data: result.extractedData,
    needs_review: result.needsReview,
  };
});
