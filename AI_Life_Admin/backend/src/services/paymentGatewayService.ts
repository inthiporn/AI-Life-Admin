/**
 * Placeholder Payment Gateway client.
 * Swap the body of `chargePayment` for a real integration (e.g. Omise, 2C2P, Stripe)
 * once a provider is selected per docs/tech-spec.md §1.2 Technology Stack.
 */

export interface ChargeRequest {
  amount: number;
  gatewayTokenRef: string;
  referenceId: string;
}

export interface ChargeResult {
  success: boolean;
  providerRef?: string;
  failureReason?: string;
}

export async function chargePayment(req: ChargeRequest): Promise<ChargeResult> {
  if (!req.gatewayTokenRef) {
    return { success: false, failureReason: "missing_gateway_token" };
  }
  // TODO: replace with real HTTPS call to the chosen Payment Gateway provider.
  return { success: true, providerRef: `pg_${req.referenceId}` };
}
