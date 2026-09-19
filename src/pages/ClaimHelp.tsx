// "How to claim your listing" guide page. Ported from OpenDesign artifact
// claim-help-template.html (perry-landing-ui-758e, 2026-09-18). Replaces the
// old legal-style draft: no draft notice (it contradicted the live claim
// flow and every claim CTA), three phase cards instead of a dense 8-step
// wall, a "what the form asks" preview, and a real CTA (the page was a dead
// end). The wording mirrors the actual flow in Claim.tsx and consent.ts.
// Step-card, hero, and button classes are reused from the landing page's
// global styles; only .guide-lead/.form-asks/.guide-links are new.

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRICING_TIERS } from '../data/pricing'
import { CouponRow, useFoundingCoupon } from '../components/FoundingCoupon'

// Plan cards for this guide (Arbo 2026-09-19: Klamath format, Set D colors).
// Prices + feature lines come from data/pricing.ts (single source, same
// values the pricing page shows); the one-liner and CTA are page copy.
// The Managed Growth CTA opens the real chat widget (the reference's
// "Chat with us" button does the same); it is a button, not a link.
const PLAN_META: Record<
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

function openChat() {
  // The fab TOGGLES, so blind-clicking it would close an already-open
  // panel. Check first: the card CTA's job is "show the chat", idempotent.
  if (document.querySelector('.chatbot-panel')) return
  document.querySelector<HTMLButtonElement>('.chatbot-fab')?.click()
}

export function ClaimHelp() {
  const c = useFoundingCoupon()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  // If the visitor opened this guide from a listing detail page, send them
  // back there; otherwise the back link goes to the directory grid, which
  // is what its label says (the old version routed "directory" to "/").
  const backTo = from && from.startsWith('/listing/') ? from : '/directory'
  const backLabel = backTo === '/directory' ? 'Back to the directory' : 'Back to the listing'

  // The page owns its tab title (same pattern as Category and ListingDetail;
  // App's RouteTitleSync skips /claim-help).
  useEffect(() => {
    document.title = 'How to claim your listing | Perry Business Directory'
  }, [])

  return (
    <div className="page">
      {/* Plans section sits FIRST per Arbo 2026-09-19 (moved from the page
          bottom to above the claim hero). */}
      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading">Plans for every stage</h2>
        <p className="landing-section-sub">
          The listing is free. Pay only when you want more visibility, or when
          you want us to handle your whole online presence.
        </p>
        {/* Founding-member coupon row, same shared component as the pricing
            page (Arbo 2026-09-19: header+row combined with the plan cards).
            Applying the code reveals the founding price on Premium below. */}
        <CouponRow
          coupon={c.coupon}
          setCoupon={c.setCoupon}
          apply={c.apply}
          error={c.error}
          applied={c.applied}
          successText="Founding member price applied to the Premium plan below."
        />
        <div className="owner-plans">
          {PLANS.map((p) => {
            const showFounding = c.applied && p.tier.foundingPrice
            return (
            <div key={p.tier.name} className="owner-plan-card">
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
      </section>

      <section className="landing-hero" aria-labelledby="claim-help-heading">
        <h1 id="claim-help-heading">How to claim your listing</h1>
        <p className="landing-hero-sub">
          Claiming is free and takes a few minutes.
        </p>
        <p className="guide-lead">
          Claiming means you take control of your business page. You can fix
          your info, add your hours, and add photos. Once a listing is claimed,
          no one else can change it.
        </p>
        <div className="landing-hero-actions">
          <Link className="landing-btn landing-btn-primary" to="/directory">
            Find your business
          </Link>
        </div>
      </section>

      <section aria-labelledby="phases-heading">
        <h2 id="phases-heading">Claiming works in three phases</h2>
        <p className="landing-section-sub">
          It starts on your own listing page, and it ends with a hand review by
          our team.
        </p>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-num" aria-hidden="true">1</span>
            <p className="landing-step-text">
              <strong>Find your listing.</strong> Search the directory or
              browse by category, then open your business page.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">2</span>
            <p className="landing-step-text">
              <strong>Tell us who you are.</strong> The claim form asks your
              name, your relationship to the business, and how you would like
              to verify.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">3</span>
            <p className="landing-step-text">
              <strong>We confirm it.</strong> A real person reviews every claim
              by hand and approves it.
            </p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="form-asks-heading">
        <h2 id="form-asks-heading">What the form asks</h2>
        <p className="landing-section-sub">
          The form is short. Here is every question it asks, before you open
          it.
        </p>
        <dl className="form-asks">
          <div className="form-ask">
            <dt>Your details</dt>
            <dd>Your first name and last name. Both are required.</dd>
          </div>
          <div className="form-ask">
            <dt>Your relationship</dt>
            <dd>
              Choose one: owner, co-owner, general manager, or authorized
              employee.
            </dd>
          </div>
          <div className="form-ask">
            <dt>How you would like to verify</dt>
            <dd>Choose one: a phone call, an email, or a manual review.</dd>
          </div>
          <div className="form-ask">
            <dt>Contact preferences</dt>
            <dd>
              Optional ticks for email, text messages, or phone calls. Every
              one is optional, you can skip them all.
            </dd>
          </div>
          <div className="form-ask">
            <dt>Agreement</dt>
            <dd>
              A box to agree to the <Link to="/terms">terms of use</Link> and
              the <Link to="/privacy">privacy notice</Link>.
            </dd>
          </div>
          <div className="form-ask">
            <dt>Submit claim</dt>
            <dd>
              The last step is a button labeled &quot;Submit claim&quot;.
              Press it to send your claim.
            </dd>
          </div>
        </dl>

        <div className="claim-benefits">
          <p className="claim-benefits-title">What happens next</p>
          <p>
            After you submit, a real person checks that you own the business.
            Once it is confirmed, the listing is yours to manage. We reach out
            using the contact method you chose.
          </p>
        </div>
      </section>

      <div className="guide-links">
        <p className="guide-fine">
          Not sure what claiming is?{' '}
          <Link to="/pricing">See plans and what claiming unlocks</Link>.
        </p>
        <Link className="btn" to={backTo}>
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
