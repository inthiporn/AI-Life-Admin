import { generateTransactionRef } from "../src/utils/generateReference";

describe("generateTransactionRef", () => {
  it("builds a TX-prefixed reference from the date and bill id", () => {
    const date = new Date(Date.UTC(2026, 5, 15)); // 2026-06-15
    const ref = generateTransactionRef("bill_abc123", date);
    expect(ref).toBe("TX20260615ABC123");
  });

  it("always starts with TX and has no separators", () => {
    const ref = generateTransactionRef("bill_xyz789", new Date(Date.UTC(2026, 0, 1)));
    expect(ref).toMatch(/^TX\d{8}[A-Z0-9]{6}$/);
  });
});
