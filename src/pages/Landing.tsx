import { Link } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { CATEGORIES } from '../data/categories'
import { BRAND_CITY, BRAND_STATE_FULL } from '../data/brand'

// Landing page (UI buildout piece a). Port of the OpenDesign "Quiet Local"
// artifact (research/ui-buildout-od-2026-09-15/) into the app shell, refined
// 2026-09-16 (OpenDesign run): "Perry, Georgia" wording + "Real local
// businesses" anchor band. Stats are derived from LISTINGS at render so they
// stay true when data or photos change. Copy is placeholder-marked pending
// brand decisions.
const totalListings = LISTINGS.length
const photosCount = LISTINGS.filter((l) => l.image).length
const categoryCount = CATEGORIES.length

// The 8 anchor businesses in the credibility band, by slug, with the plain
// category label shown under each name (display copy only; the underlying
// listings supply name + logo from data). Chosen across trades so a visitor
// can spot their own. These include national affiliates, so no copy claims
// local ownership.
const ANCHOR_SLUGS: { slug: string; label: string }[] = [
  { slug: 'bodega-brew', label: 'Cafes and coffee' },
  { slug: 'kidstrong-perry', label: 'Fitness' },
  { slug: 'hoke-s-heating-air', label: 'Heating and air' },
  { slug: 'cossart-design', label: 'Home and furniture' },
  { slug: 'hamby-automotive-network', label: 'Auto repair' },
  { slug: 'abba-house', label: 'Community nonprofit' },
  { slug: 'kinetic', label: 'Marketing and media' },
  { slug: 'air-evac-lifeteam', label: 'Medical transport' },
]
const anchors = ANCHOR_SLUGS.flatMap((a) => {
  const l = LISTINGS.find((x) => x.slug === a.slug)
  return l && l.image
    ? [{ slug: l.slug, name: l.business_name, image: l.image, label: a.label }]
    : []
})

// Anchor logos too faint (thin near-transparent art) to float on the navy
// card sit on a white plate instead; see .landing-biz-logo--plate in CSS.
const PLATE_SLUGS = new Set(['cossart-design'])

// Category tile photos (UI, 2026-09-16). Every file depicts a real Perry or
// Houston County location in that trade, from Wikimedia Commons, all
// photographer Michael Rivera (courthouse image CC BY-SA 3.0, rest 4.0;
// credit in the site footer). Stored resized under public/perry/cat/.
// The mapping covers all 9 category slugs, so tiles always carry a photo.
const CAT_PHOTOS: Record<string, string> = {
  restaurants: 'restaurants.jpg', // Swanson Restaurant, Perry
  'home-services': 'home-services.jpg', // Perry Public Safety Building
  medical: 'medical.jpg', // Houston Medical Center, Warner Robins (county hospital)
  legal: 'legal.jpg', // Houston County Courthouse, east face
  auto: 'auto.jpg', // Quick Serve Gas Station, Main St
  retail: 'retail.jpg', // Dollar General, Main St
  fitness: 'fitness.jpg', // Perry High School football stadium
  'professional-services': 'professional-services.jpg', // The Bank of Perry
  nonprofits: 'nonprofits.jpg', // Perry United Methodist Church
}

export function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero landing-hero-photo">
        <img
          className="landing-hero-photo-img"
          src={`${import.meta.env.BASE_URL}perry/city-hall.jpg`}
          alt="Perry City Hall on the historic courthouse square"
        />
        <h1>Find trusted local businesses in {BRAND_CITY}, {BRAND_STATE_FULL}.</h1>
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
            const photo = CAT_PHOTOS[c.slug]
            return (
              <li key={c.slug}>
                <Link className="landing-cat-tile" to={`/category/${c.slug}`}>
                  {photo && (
                    <span className="landing-cat-photo">
                      <img
                        src={`${import.meta.env.BASE_URL}perry/cat/${photo}`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                      />
                    </span>
                  )}
                  <span className="landing-cat-body">
                    <span className="landing-cat-name">{c.name}</span>
                    <span className="landing-cat-count">{count} businesses</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section
        className="landing-section"
        aria-labelledby="landing-anchors-heading"
      >
        <h2 id="landing-anchors-heading">Real local businesses</h2>
        <p className="landing-section-sub">
          A few of the {totalListings} listings, each with a verified street
          address and phone number.
        </p>
        <ul className="landing-anchor-grid">
          {anchors.map((a) => (
            <li key={a.slug}>
              <Link className="landing-biz-tile" to={`/listing/${a.slug}`}>
                <span
                  className={"landing-biz-logo" + (PLATE_SLUGS.has(a.slug) ? " landing-biz-logo--plate" : "")}
                >
                  <img
                    src={import.meta.env.BASE_URL + a.image.replace(/^\//, '')}
                    alt={`${a.name} logo`}
                    loading="lazy"
                  />
                </span>
                <span className="landing-biz-body">
                  <span className="landing-biz-name">{a.name}</span>
                  <span className="landing-biz-cat">{a.label}</span>
                </span>
              </Link>
            </li>
          ))}
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
              <strong>Find it fast.</strong> Search by keyword or browse the
              categories to find a local business.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">2</span>
            <p className="landing-step-text">
              <strong>Trust the listing.</strong> Every entry is verified
              against public sources and carries a real address and phone
              number.
            </p>
          </li>
          <li>
            <span className="landing-step-num" aria-hidden="true">3</span>
            <p className="landing-step-text">
              <strong>Claim it free.</strong> Business owners can claim their
              listing for free and update it anytime.
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
