import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/admin";
import { requireAuth, requireField } from "../lib/assert";
import { extractDocumentData } from "../lib/ocrProvider";

interface ScanDocumentRequest {
  file_path: string; // Firebase Storage path, e.g. users/{uid}/documents/{id}.jpg
  doc_type: string; // e.g. "national_id"
}

const MIN_CONFIDENCE = 0.7;

/** Calls the AI/OCR provider on an uploaded document and saves the result. */
export const scanDocument = onCall<ScanDocumentRequest>(async (request) => {
  const uid = requireAuth(request);
  const filePath = requireField(request.data.file_path, "file_path");
  const docType = requireField(request.data.doc_type, "doc_type");

  if (!filePath.startsWith(`users/${uid}/`)) {
    throw new HttpsError("permission-denied", "ไม่มีสิทธิ์เข้าถึงไฟล์นี้");
  }

  const result = await extractDocumentData(filePath);
  const needsReview = result.confidence < MIN_CONFIDENCE;

  const docRef = await db.collection("documents").add({
    user_id: uid,
    doc_type: docType,
    file_path: filePath,
    extracted_data: result.data,
    status: "pending",
    needs_review: needsReview,
    scanned_at: FieldValue.serverTimestamp(),
  });

  return { document_id: docRef.id, extracted_data: result.data, needs_review: needsReview };
});
