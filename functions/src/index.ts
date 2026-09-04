// AI Life Admin — Cloud Functions entry point
// See docs/tech-spec.md §3.2 for the API surface these implement.

export { setPin } from "./auth/setPin";
export { setupBiometric } from "./auth/setupBiometric";
export { reauthenticate } from "./auth/reauthenticate";
export { scanDocument } from "./documents/scanDocument";
export { processPayment } from "./payments/processPayment";
export { deleteAccount } from "./account/deleteAccount";
export { onBillOverdue } from "./scheduled/onBillOverdue";
