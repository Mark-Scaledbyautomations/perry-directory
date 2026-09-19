import { PRICING_TIERS } from '../data/pricing'
import { CouponRow, useFoundingCoupon } from '../components/FoundingCoupon'

// Pricing ladder page. Comparison only: no checkout, no payment. Values are
// the exact verified ladder from the Klamath Falls build. The founding-member
// coupon lives in the shared FoundingCoupon component (the business-owners
// guide uses the same one), so the code and reveal cannot drift between pages.

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

      <div className="pricing-grid">
        {PRICING_TIERS.map((tier) => {
          const showFounding = c.applied && tier.foundingPrice
          return (
            <div key={tier.name} className="pricing-card">
              <h2 className="pricing-name">{tier.name}</h2>
              <p className="pricing-price">
                {showFounding ? tier.foundingPrice : tier.price}
                {showFounding && (
                  <span className="pricing-was"> {tier.price}</span>
                )}
                {!showFounding && tier.wasPrice && (
                  <span className="pricing-was"> {tier.wasPrice}</span>
                )}
              </p>
              <p className="pricing-period">{tier.period}</p>
              {tier.monthlyNote && (
                <p className="pricing-note">{tier.monthlyNote}</p>
              )}
              {showFounding && (
                <p className="pricing-founding">
                  Founding member price for the first year.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
