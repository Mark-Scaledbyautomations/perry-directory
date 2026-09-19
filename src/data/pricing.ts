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
  // Short what-you-get lines for the plan cards on the business-owners
  // guide (2026-09-19, Arbo: Klamath format, Set D colors). Free lines are
  // SHIPPED mechanics (claim form: corrections, contact ticks, optional
  // logo/photo, public pages). Paid lines describe what a paid plan is for;
  // nothing paid is automated yet, so they read as intent, never "you get".
  features: string[]
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
    features: [
      'Verified ownership of your listing',
      'Correct your name, address, and phone',
      'Add your description and categories',
      'Optional logo or photo',
      'Appear on search and category pages',
      'Marketing consent never required',
    ],
  },
  {
    name: 'Featured Listing',
    price: '$99',
    wasPrice: '$250',
    period: 'your first year, then $250 per year',
    monthlyNote: 'Prefer monthly? $49/month',
    features: [
      'Everything in Free',
      'Featured badge on your listing',
      'Top-of-category placement',
      'A fuller profile with photos and links',
      'A call-to-action button',
    ],
  },
  {
    name: 'Premium Listing',
    price: '$699',
    wasPrice: '',
    period: 'per year',
    foundingPrice: '$249',
    features: [
      'Everything in Featured',
      'Priority placement across the directory',
      'A monthly visibility report',
      'Help answering customer reviews',
      'A direct line to our team',
    ],
  },
  {
    name: 'Managed Growth Package',
    price: '~$125',
    wasPrice: '',
    period: 'per month + one-time setup from $777',
    features: [
      'Everything in Premium',
      'Your website built or refreshed, hosted and managed',
      'Google Business Profile setup and optimization',
      'Ongoing local-search work',
      'An AI chat assistant on your site',
      'Month-to-month, no long contract',
    ],
  },
]
