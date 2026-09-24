import { Link } from 'react-router-dom'
import { PRICING_TIERS } from '../data/pricing'

// Plan cards, shared with the /pricing page (extracted 2026-09-24 so the
// two pages cannot drift; Arbo: the plans page must match this design).
// Arbo 2026-09-19: Klamath format, Set D colors. Prices + feature lines
// come from data/pricing.ts (single source); the one-liner and CTA are
// page copy. The Managed Growth CTA opens the real chat widget (the
// reference's "Chat with us" button does the same); it is a button, not
// a link.
export const PLAN_META: Record<
  string,
  { desc: string; ctaLabel: string; ctaTo?: string; chat?: boolean }
> = {
  'Free Listing': {
    desc: 'Claim and correct your business listing. No purchase is required, ever.',
    ctaLabel: 'Claim your free listing',
    ctaTo: '/directory',
  },
  'Featured Listing': {
    desc: 'Stand out where customers are already looking. $99 your first year, a discount from $250.',
    ctaLabel: 'Claim first, then upgrade',
    ctaTo: '/directory',
  },
  'Premium Listing': {
    desc: 'Everything in Featured plus hands-on help.',
    ctaLabel: 'Claim first, then upgrade',
    ctaTo: '/directory',
  },
  'Managed Growth Package': {
    desc: 'We run your online presence so you can run your business.',
    ctaLabel: 'Chat with us',
    chat: true,
  },
}

const PLANS = PRICING_TIERS.map((tier) => ({ tier, ...PLAN_META[tier.name] }))

// The plan-card grid itself, shared by both pages. extraNotes inserts page-
// specific fine print (the /pricing monthly line) after the period line of
// the matching tier.
export function PlanCards({
  applied,
  extraNotes,
}: {
  applied: boolean
  extraNotes?: Record<string, string>
}) {
  return (
    <div className="owner-plans">
      {PLANS.map((p) => {
        const showFounding = applied && p.tier.foundingPrice
        const premium = p.tier.name === 'Premium Listing'
        return (
          <div
            key={p.tier.name}
            className={premium ? 'owner-plan-card owner-plan-card--offer' : 'owner-plan-card'}
          >
            {premium && (
              <span className="plan-flag">Most popular</span>
            )}
            <p className="owner-plan-name">{p.tier.name}</p>
            <p className="owner-plan-desc">{p.desc}</p>
            <p className="owner-plan-price">
              {showFounding ? p.tier.foundingPrice : p.tier.price}
              {(showFounding ? p.tier.price : p.tier.wasPrice) && (
                <span className="owner-plan-was">
                  {showFounding ? p.tier.price : p.tier.wasPrice}
                </span>
              )}
            </p>
            <p className="owner-plan-period">{p.tier.period}</p>
            {extraNotes?.[p.tier.name] && (
              <p className="pricing-note">{extraNotes[p.tier.name]}</p>
            )}
            {showFounding && (
              <p className="pricing-founding">
                Founding member price for the first year.
              </p>
            )}
            <ul className="owner-plan-features">
              {p.tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {p.chat ? (
              <button
                type="button"
                className="owner-plan-cta owner-plan-cta-deep"
                onClick={openChat}
              >
                {p.ctaLabel}
              </button>
            ) : (
              <Link
                className={
                  p.tier.name === 'Free Listing'
                    ? 'owner-plan-cta owner-plan-cta-free'
                    : premium
                      ? 'owner-plan-cta owner-plan-cta-offer'
                      : 'owner-plan-cta'
                }
                to={p.ctaTo ?? '/directory'}
              >
                {p.ctaLabel}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

function openChat() {
  // The fab TOGGLES, so blind-clicking it would close an already-open
  // panel. Check first: the card CTA's job is "show the chat", idempotent.
  if (document.querySelector('.chatbot-panel')) return
  document.querySelector<HTMLButtonElement>('.chatbot-fab')?.click()
}
