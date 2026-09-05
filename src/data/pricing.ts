// Pricing ladder, verified against the live klamathbusinesses.com bundle
// (index-BFqQiafp.js, fetched 2026-08-29). Exact values. Do not re-derive.

export interface PricingTier {
  name: string
  price: string
  wasPrice: string
  period: string
  monthlyNote?: string
}

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
  },
  {
    name: 'Managed Growth Package',
    price: '~$125',
    wasPrice: '',
    period: 'per month + one-time setup from $777',
  },
]
