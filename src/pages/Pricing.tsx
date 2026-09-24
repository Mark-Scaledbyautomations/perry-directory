import { PRICING_TIERS } from '../data/pricing'
import { CouponRow, useFoundingCoupon } from '../components/FoundingCoupon'
import { PlanCards } from '../components/PlanCards'

// Pricing ladder page. Comparison only: no checkout, no payment. Values are
// the exact verified ladder from the Klamath Falls build. The cards render
// through the shared PlanCards component (extracted from the business-owners
// guide, 2026-09-24, Arbo: this page must match that design), so the two
// pages cannot drift; prices and feature lines stay from data/pricing.ts.
// This page keeps the extra monthly-payment note (comparison detail the
// guide omits).

// Monthly-payment fine print, keyed by tier name; from PRICING_TIERS.
const MONTHLY_NOTES: Record<string, string> = Object.fromEntries(
  PRICING_TIERS.filter((t) => t.monthlyNote).map((t) => [t.name, t.monthlyNote!]),
)

export function Pricing() {
  const c = useFoundingCoupon()

  return (
    <div className="page">
      <h1 className="page-title">Featured listings and packages</h1>
      <p className="page-sub">
        A free listing is always available. Paid tiers put your business in
        front of more local customers.
      </p>

      <CouponRow
        coupon={c.coupon}
        setCoupon={c.setCoupon}
        apply={c.apply}
        error={c.error}
        applied={c.applied}
        successText="Founding member price applied to the Premium Listing."
      />

      <PlanCards applied={c.applied} extraNotes={MONTHLY_NOTES} />
    </div>
  )
}
