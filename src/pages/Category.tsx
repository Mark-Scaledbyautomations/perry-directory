import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { BRAND_CITY, BRAND_STATE_FULL } from '../data/brand'

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
  const category = categoryBySlug(slug)
  const listings = category
    ? LISTINGS.filter((l) => l.category_slug === category.slug)
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
  for (const l of listings) {
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
          {listings.length} {listings.length === 1 ? 'business' : 'businesses'}
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
          {listings.map((l) => (
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
          <h2 id="cat-claim-heading">
            Own a business in {BRAND_CITY}? Your listing is already here.
          </h2>
          <p>
            Claiming is free and takes a few minutes. Once claimed, you can
            confirm your details and keep your address and phone number up to
            date.
          </p>
          <Link className="landing-btn landing-btn-primary" to="/claim-help">
            Claim your listing
          </Link>
        </div>
      </section>
    </div>
  )
}
