import { useState } from 'react'
import { PRICING_TIERS, FOUNDING_COUPON_CODE } from '../data/pricing'

// Pricing ladder page. Comparison only: no checkout, no payment. Values are
// the exact verified ladder from the Klamath Falls build. A founding-member
// coupon reveals the discounted Premium price; the coupon is a display
// affordance, not a payment gate (the real price is enforced at the payment
// link, Phase 3).

export function Pricing() {
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === FOUNDING_COUPON_CODE) {
      setApplied(true)
      setError('')
    } else {
      setApplied(false)
      setError('That code is not recognized')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Featured listings and packages</h1>
      <p className="page-sub">
        A free listing is always available. Paid tiers put your business in
        front of more local customers.
      </p>

      <div className="coupon-row">
        <input
          className="coupon-input"
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Founding member code"
          aria-label="Founding member code"
        />
        <button className="coupon-apply" onClick={applyCoupon}>
          Apply
        </button>
      </div>
      {error && <p className="coupon-error">{error}</p>}
      {applied && (
        <p className="coupon-success">
          Founding member price applied to the Premium Listing.
        </p>
      )}

      <div className="pricing-grid">
        {PRICING_TIERS.map((tier) => {
          const showFounding = applied && tier.foundingPrice
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
