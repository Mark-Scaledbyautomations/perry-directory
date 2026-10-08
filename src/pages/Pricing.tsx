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

      <section className="upgrade-path">
        <h2 className="upgrade-path-title">How the upgrade path works</h2>
        <ol className="upgrade-path-steps">
          <li>
            <strong>Claim free.</strong> Verify ownership and fix your listing.
            Marketing consent is optional and separate; claiming never
            requires it.
          </li>
          <li>
            <strong>Go Featured when it makes sense.</strong> $99 for your
            first year puts you at the top of your category with a bigger
            profile, a discount from $250 a year.
          </li>
          <li>
            <strong>Hand it all to us if you'd rather.</strong> The Managed
            Growth Package covers your website, Google Business Profile, and
            local-search work for about $125 a month after setup.
          </li>
        </ol>
        <p className="upgrade-path-note">
          The next step for the Managed Growth Package is the site chat. No
          outbound sales contact happens unless you've explicitly opted in.
        </p>
      </section>
    </div>
  )
}
