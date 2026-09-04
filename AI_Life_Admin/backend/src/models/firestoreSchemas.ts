import { Timestamp } from "firebase-admin/firestore";

/** users/{userId} — doc ID is the Firebase Authentication UID */
export interface UserDoc {
  email?: string | null;
  phone_number?: string | null;
  pin_hash?: string | null;
  biometric_enabled: boolean;
  preferred_language: string;
  status: "active" | "suspended";
  reauth?: {
    token: string;
    expires_at: Timestamp;
  } | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** users/{userId}/devices/{deviceId} */
export interface DeviceDoc {
  device_name: string;
  os?: string;
  location?: string;
  ip_address?: string;
  is_trusted: boolean;
  last_active_at: Timestamp;
  created_at: Timestamp;
}

/** users/{userId}/payment_methods/{paymentMethodId} */
export interface PaymentMethodDoc {
  type: "promptpay" | "credit_card" | "debit_card" | "auto_debit";
  details_masked: string;
  gateway_token_ref: string;
  is_default: boolean;
  created_at: Timestamp;
}

/** documents/{documentId} (top-level) */
export interface DocumentDoc {
  user_id: string;
  doc_type: string;
  file_path: string;
  extracted_data?: Record<string, unknown> | null;
  status: "pending" | "reviewed";
  needs_review?: boolean;
  scanned_at: Timestamp;
}

/** bills/{billId} (top-level) */
export interface BillDoc {
  user_id: string;
  category_id: string;
  document_id?: string | null;
  provider_name?: string | null;
  reference_number?: string | null;
  amount: number;
  due_date: Timestamp;
  status: "pending" | "processing" | "paid" | "overdue" | "cancelled";
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** transactions/{transactionRef} — doc ID = transaction_ref (natural key) */
export interface TransactionDoc {
  bill_id: string;
  payment_method_ref: string;
  user_id: string;
  amount: number;
  status: "processing" | "success" | "failed";
  paid_at: Timestamp | null;
  created_at: Timestamp;
}

/** users/{userId}/notifications/{notificationId} */
export interface NotificationDoc {
  title: string;
  message: string;
  type: "bill_reminder" | "payment_success" | "security_alert";
  is_read: boolean;
  created_at: Timestamp;
}

/** users/{userId}/security_logs/{logId} */
export interface SecurityLogDoc {
  event_type: string;
  ip_address?: string;
  device_info?: string;
  created_at: Timestamp;
}
