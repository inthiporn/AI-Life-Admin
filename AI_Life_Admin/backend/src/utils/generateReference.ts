/** Builds a human-readable transaction reference, e.g. TX20260904A1B2C3. */
export function generateTransactionRef(billId: string, now: Date = new Date()): string {
  return (
    "TX" +
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    billId.slice(-6).toUpperCase()
  );
}
