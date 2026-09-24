import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useListings } from '../data/useListings'
import { categoryBySlug } from '../data/categories'
import { BRAND_CITY, BRAND_STATE_FULL } from '../data/brand'
import { ClaimMapChip } from '../components/ClaimMapChip'

// Category pages (UI buildout piece b). Port of the OpenDesign
// category-template.html run (2026-09-16) into the app shell. Route is
// /category/<slug> for the 9 real slugs in categories.ts. Everything on the
// page is derived from LISTINGS at render: count, results, and the
// subcategory summary line (the artifact's example counts were illustrative,
// computed here so they can never drift from the data).

// Plain-English heading form of the category display name ("Restaurants &
// Food" becomes "Restaurants and Food"). Display copy only.
function displayName(name: string): string {
  return name.replace(/&/g, 'and')
}

export function Category() {
  const { slug = '' } = useParams()
  const [listings] = useListings()
  const category = categoryBySlug(slug)
  const listingsInCat = category
    ? listings.filter((l) => l.category_slug === category.slug)
    : []

  useEffect(() => {
    document.title = category
      ? `${displayName(category.name)} in ${BRAND_CITY}, ${BRAND_STATE_FULL} | Perry Business Directory`
      : 'Category not found | Perry Business Directory'
  }, [category])

  if (!category) {
    return (
      <div className="cat-page">
        <div className="cat-missing">
          <h1>Category not found</h1>
          <p>
            That category does not exist in this directory.{' '}
            <Link to="/directory">Browse the full directory</Link> instead.
          </p>
        </div>
      </div>
    )
  }

  // Subcategory counts, most common first (ties break by label), shown as
  // plain inline text, never as clickable chips.
  const subCounts = new Map<string, number>()
  for (const l of listingsInCat) {
    const sub = l.subcategory || 'Other'
    subCounts.set(sub, (subCounts.get(sub) || 0) + 1)
  }
  const subs = [...subCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )
  const shownSubs = subs.slice(0, 4)
  const subLine = shownSubs.map(([name, n]) => `${name} (${n})`).join(', ')
  const moreSuffix = subs.length > shownSubs.length ? ', and more' : ''
  const name = displayName(category.name)

  return (
    <div className="cat-page">
      <nav className="cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/directory">Directory</Link>
        <span className="cat-breadcrumb-sep" aria-hidden="true">&gt;</span>
        <span className="cat-breadcrumb-current" aria-current="page">
          {category.name}
        </span>
      </nav>

      <section className="cat-hero" aria-labelledby="category-heading">
        <h1 id="category-heading">
          {name} in {BRAND_CITY}, {BRAND_STATE_FULL}.
        </h1>
        <p className="cat-hero-sub">{category.description}</p>
        <p className="cat-count">
          {listingsInCat.length} {listingsInCat.length === 1 ? 'business' : 'businesses'}
        </p>
        {subs.length > 1 && (
          <p className="cat-subcategories">
            Subcategories include: {subLine}
            {moreSuffix}.
          </p>
        )}
      </section>

      <section className="cat-results" aria-labelledby="cat-results-heading">
        <h2 id="cat-results-heading" className="cat-visually-hidden">
          {name} businesses
        </h2>
        <ul className="cat-results-list">
          {listingsInCat.map((l) => (
            <li key={l.slug}>
              <div className="cat-biz-card">
                <div className="cat-biz-card-text">
                  <h3>
                    <Link to={`/listing/${l.slug}`}>{l.business_name}</Link>
                  </h3>
                  {l.subcategory && (
                    <p className="cat-biz-cat">{l.subcategory}</p>
                  )}
                  {l.street_address && (
                    <p className="cat-biz-addr">
                      {l.street_address}, {l.city}, {l.state} {l.zip_code}
                    </p>
                  )}
                  {l.phone && <p className="cat-biz-phone">{l.phone}</p>}
                </div>
                {l.image && (
                  <div className="cat-biz-logo">
                    <img
                      src={
                        import.meta.env.BASE_URL + l.image.replace(/^\//, '')
                      }
                      alt={`${l.business_name} logo`}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-claim" aria-labelledby="cat-claim-heading">
        <div className="landing-claim-card">
          <div className="landing-claim-copy">
            <span className="landing-claim-badge">
              <ClaimMapChip />
            </span>
            <h2 id="cat-claim-heading">
              Your {BRAND_CITY} business is already here.
            </h2>
            <p>
              Gain <strong>full control</strong>. Claiming is <strong>free</strong>{' '}
              and takes just minutes. Update your address and contact details,
              and keep everything current for your customers.
            </p>
          </div>
          <div className="landing-claim-cta">
            <Link className="landing-btn landing-btn-primary" to="/claim-help">
              Claim your listing
            </Link>
            <ul className="landing-claim-pts">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5h4s1.5-5 4-5a2.5 2.5 0 0 1 0 5h-4Z" />
                </svg>
                Free to claim
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Quick setup
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Person-reviewed claim
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
