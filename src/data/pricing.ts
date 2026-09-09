// Pricing ladder, verified against the live klamathbusinesses.com bundle
// (index-BFqQiafp.js, fetched 2026-08-29). Exact values. Do not re-derive.

export interface PricingTier {
  name: string
  price: string
  wasPrice: string
  period: string
  monthlyNote?: string
  // The founding-member discounted price, shown only when a valid coupon is
  // applied. Present on Premium only. This is a display value, not a payment
  // gate: the real price is enforced at the payment link (Phase 3).
  foundingPrice?: string
}

// The founding-member coupon code. PLACEHOLDER: this is a clearly-marked
// stand-in, trivial to change later (likely to match the final brand name,
// which is also still a placeholder). Swap this one string in one pass.
export const FOUNDING_COUPON_CODE = 'FOUNDERS'

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free Listing',
    price: '$0',
    wasPrice: '',
    period: 'forever',
  },
  {
    name: 'Featured Listing',
    price: '$99',
    wasPrice: '$250',
    period: 'your first year, then $250 per year',
    monthlyNote: 'Prefer monthly? $49/month',
  },
  {
    name: 'Premium Listing',
    price: '$699',
    wasPrice: '',
    period: 'per year',
    foundingPrice: '$249',
  },
  {
    name: 'Managed Growth Package',
    price: '~$125',
    wasPrice: '',
    period: 'per month + one-time setup from $777',
  },
]
