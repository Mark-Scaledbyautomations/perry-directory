import { PRICING_TIERS } from '../data/pricing'

// Pricing ladder page. Comparison only: no checkout, no payment. Values are
// the exact verified ladder from the Klamath Falls build.

export function Pricing() {
  return (
    <div className="page">
      <h1 className="page-title">Featured listings and packages</h1>
      <p className="page-sub">
        A free listing is always available. Paid tiers put your business in
        front of more local customers.
      </p>

      <div className="pricing-grid">
        {PRICING_TIERS.map((tier) => (
          <div key={tier.name} className="pricing-card">
            <h2 className="pricing-name">{tier.name}</h2>
            <p className="pricing-price">
              {tier.price}
              {tier.wasPrice && (
                <span className="pricing-was"> {tier.wasPrice}</span>
              )}
            </p>
            <p className="pricing-period">{tier.period}</p>
            {tier.monthlyNote && (
              <p className="pricing-note">{tier.monthlyNote}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
