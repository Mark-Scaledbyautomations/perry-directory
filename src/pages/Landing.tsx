import { Link } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { CATEGORIES } from '../data/categories'
import { BRAND_CITY, BRAND_STATE } from '../data/brand'

// Landing page (UI buildout piece a). Port of the OpenDesign "Quiet Local"
// artifact (research/ui-buildout-od-2026-09-15/) into the app shell.
// Stats are derived from LISTINGS at render so they stay true when data or
// photos change. Copy is placeholder-marked pending brand decisions.
const totalListings = LISTINGS.length
const photosCount = LISTINGS.filter((l) => l.image).length
const categoryCount = CATEGORIES.length

export function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>Find trusted local businesses in {BRAND_CITY}, {BRAND_STATE}.</h1>
        <p className="landing-hero-sub">
          Every listing has a real street address and a phone number you can
          call today.
        </p>
        <div className="landing-hero-actions">
          <Link className="landing-btn landing-btn-primary" to="/directory">
            Browse the directory
          </Link>
          <Link className="landing-btn landing-btn-secondary" to="/add">
            Claim your business listing
          </Link>
        </div>
      </section>

      <section className="landing-stats" aria-label="Directory at a glance">
        <div className="landing-stats-card">
          <div className="landing-stats-grid">
            <div className="landing-stat-cell">
              <span className="landing-stat-num">{totalListings}</span>
              <span className="landing-stat-label">local businesses listed</span>
            </div>
            <div className="landing-stat-cell">
              <span className="landing-stat-num">{categoryCount}</span>
              <span className="landing-stat-label">business categories</span>
            </div>
            <div className="landing-stat-cell">
              <span className="landing-stat-num">{photosCount}</span>
              <span className="landing-stat-label">businesses with photos</span>
            </div>
            <div className="landing-stat-cell">
              <span className="landing-stat-num">$0</span>
              <span className="landing-stat-label">cost to claim a listing</span>
            </div>
          </div>
          <p className="landing-stats-note">
            Numbers are from our September 2026 audit.
          </p>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="landing-categories-heading">
        <h2 id="landing-categories-heading">Browse by category</h2>
        <p className="landing-section-sub">
          Nine categories cover all {totalListings} listings in the directory.
        </p>
        <ul className="landing-category-grid">
          {CATEGORIES.map((c) => {
            const count = LISTINGS.filter((l) => l.category_slug === c.slug).length
            return (
              <li key={c.slug}>
                <Link className="landing-cat-tile" to={`/directory?category=${c.slug}`}>
                  <span className="landing-cat-name">{c.name}</span>
                  <span className="landing-cat-count">{count} businesses</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="landing-section" aria-labelledby="landing-how-heading">
        <h2 id="landing-how-heading">How the directory works</h2>
        <p className="landing-section-sub">
          Three things worth knowing before you browse or claim.
        </p>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-num" aria-hidden="true">1</span>
            <p className="landing-step-text">
              Search by keyword or browse the categories to find a local business.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">2</span>
            <p className="landing-step-text">
              Every listing is verified against public sources and carries a real
              address and phone number.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">3</span>
            <p className="landing-step-text">
              Business owners can claim their listing for free and update it.
            </p>
          </li>
        </ol>
      </section>

      <section className="landing-claim" aria-labelledby="landing-claim-heading">
        <div className="landing-claim-card">
          <h2 id="landing-claim-heading">
            Own a business in {BRAND_CITY}? Your listing is already here.
          </h2>
          <p>
            Claiming is free and takes a few minutes. Once claimed, you can
            confirm your details and keep your address and phone number up to
            date.
          </p>
          <Link className="landing-btn landing-btn-primary" to="/add">
            Claim your listing
          </Link>
        </div>
      </section>
    </div>
  )
}
