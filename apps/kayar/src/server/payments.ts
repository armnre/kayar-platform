/**
 * Payment gateway contract. No gateway is connected yet: every payment is
 * recorded with status «در انتظار درگاه» and no money moves. To go live,
 * implement `PaymentGateway` for a provider (Zarinpal, IDPay, Stripe…) and
 * return it from `getGateway()` when its secret is present.
 */
export interface PaymentGateway {
  name: string;
  createPayment(args: { amount: number; reference: string; callbackUrl: string }): Promise<{ redirectUrl: string }>;
}

export function getGateway(): PaymentGateway | null {
  return null;
}

export function newReference() {
  return 'KY-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}
