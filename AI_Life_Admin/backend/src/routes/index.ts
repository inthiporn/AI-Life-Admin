/**
 * "Routes" for a Firebase Callable/Scheduled function backend.
 *
 * There's no Express router here — Firebase Callable Functions are invoked
 * by name via the client SDK (httpsCallable), not by HTTP path. This file
 * plays the role the `routes/` folder plays in a REST backend: the single
 * place that maps a public function name to its controller.
 *
 * See docs/tech-spec.md §3.2 for the full API surface.
 */

export { setPin, setupBiometric, reauthenticate } from "../controllers/authController";
export { scanDocument } from "../controllers/documentController";
export { processPayment } from "../controllers/paymentController";
export { deleteAccount } from "../controllers/accountController";
export { onBillOverdue } from "../jobs/onBillOverdue";
