import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { BRAND_CITY, BRAND_STATE_FULL } from '../data/brand'
import { CopyPhone } from '../components/CopyPhone'
import { DescriptionBlock } from '../components/DescriptionBlock'

// Plain-English label form of a category name ("Restaurants & Food" becomes
// "Restaurants and Food"). Same display rule the Category page uses, kept in
// sync deliberately so the breadcrumb, heading, and category H1 agree.
function displayName(name: string): string {
  return name.replace(/&/g, 'and')
}

// Google Maps link built from the listing's own street address text (a
// search-URL, not a coordinate pin: the dataset has no lat/lng, verified
// 2026-09-18, so a pinned map would be a claim we cannot back).
function mapsUrl(listing: { street_address: string | null; city: string; state: string; zip_code: string | null }): string {
  const parts = [listing.street_address, `${listing.city}, ${listing.state}`, listing.zip_code].filter(Boolean)
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(' '))}`
}

// Piece (c) listing-detail enhancements, ported from OpenDesign artifact
// listing-detail-template.html (perry-landing-ui-758e, 2026-09-18):
// breadcrumb, clickable category chip, tel:/mailto: links, Maps link, and a
// "More in {category}" related strip computed from LISTINGS at render.
export function ListingDetail() {
  const { slug } = useParams<{ slug: string }>()
  const listing = LISTINGS.find((l) => l.slug === slug)
  const [reported, setReported] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const hasLongDesc = (listing?.description || '').length > 180

  // The page owns its tab title now (the detail title pattern mirrors the
  // Category page). App's RouteTitleSync skips /listing/ paths so it cannot
  // clobber this (React runs child effects first, parent effects after).
  useEffect(() => {
    document.title = listing
      ? `${listing.business_name} in ${BRAND_CITY}, ${BRAND_STATE_FULL} | Perry Business Directory`
      : 'Listing not found | Perry Business Directory'
  }, [listing])

  if (!listing) {
    return (
      <div className="page">
        <h1 className="page-title">Listing not found</h1>
        <p>
          <Link to="/directory">Back to the directory</Link>
        </p>
      </div>
    )
  }

  const category = categoryBySlug(listing.category_slug)
  const categoryName = category ? category.name : listing.category_slug
  const related = category
    ? LISTINGS.filter(
        (l) => l.category_slug === category.slug && l.slug !== listing.slug
      )
        // Logo-bearing siblings first (cards look complete), then stable by
        // name so the strip never re-shuffles between visits.
        .sort(
          (a, b) =>
            Number(!a.image) - Number(!b.image) ||
            a.business_name.localeCompare(b.business_name)
        )
        .slice(0, 6)
    : []

  return (
    <div className="page">
      <nav className="cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/directory">Directory</Link>
        <span className="cat-breadcrumb-sep" aria-hidden="true">&gt;</span>
        <Link to={`/category/${category?.slug ?? listing.category_slug}`}>
          {displayName(categoryName)}
        </Link>
        <span className="cat-breadcrumb-sep" aria-hidden="true">&gt;</span>
        <span className="cat-breadcrumb-current" aria-current="page">
          {listing.business_name}
        </span>
      </nav>

      <div className="detail-head">
        {listing.image && (
          <div className="detail-logo">
            <img src={import.meta.env.BASE_URL + listing.image.replace(/^\//, '')} alt={`${listing.business_name} logo`} />
          </div>
        )}
        <div className="detail-titleblock">
          <h1 className="page-title">{listing.business_name}</h1>
          <p className="listing-category">
            <Link
              className="cat-chip"
              to={`/category/${category?.slug ?? listing.category_slug}`}
            >
              {categoryName}
            </Link>
            {listing.subcategory ? (
              <span className="cat-chip-sub"> · {listing.subcategory}</span>
            ) : null}
          </p>
        </div>
      </div>

      <DescriptionBlock text={listing.description} expanded={descExpanded} />
      {hasLongDesc && (
        <button
          className="see-more"
          type="button"
          onClick={() => setDescExpanded((v) => !v)}
        >
          {descExpanded ? 'See less' : 'See more'}
        </button>
      )}

      <dl className="detail-list">
        {listing.phone && (
          <div className="detail-row">
            <dt>Phone</dt>
            <dd>
              <CopyPhone phone={listing.phone} />
            </dd>
          </div>
        )}
        {listing.email && (
          <div className="detail-row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${listing.email}`}>{listing.email}</a>
            </dd>
          </div>
        )}
        {listing.website && (
          <div className="detail-row">
            <dt>Website</dt>
            <dd>
              <a href={listing.website} target="_blank" rel="noreferrer">
                {listing.website}
              </a>
            </dd>
          </div>
        )}
        {listing.street_address && (
          <div className="detail-row">
            <dt>Address</dt>
            <dd>
              {listing.street_address}, {listing.city}, {listing.state}{' '}
              {listing.zip_code ?? ''}
              <br />
              <a
                className="maps-link"
                href={mapsUrl(listing)}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </dd>
          </div>
        )}
        {listing.hours && (
          <div className="detail-row">
            <dt>Hours</dt>
            <dd>{listing.hours}</dd>
          </div>
        )}
      </dl>

      <div className="detail-actions">
        <Link className="btn btn-primary" to={`/claim/${listing.slug}`}>
          Claim this listing
        </Link>
        <button
          className="btn"
          type="button"
          onClick={() => setReported(true)}
          disabled={reported}
        >
          {reported ? 'Reported' : 'Report incorrect info'}
        </button>
      </div>
      {reported && (
        <div className="report-note" role="status">
          <span className="report-note-icon" aria-hidden="true">
            ✓
          </span>
          <span>
            Thank you. Your report was recorded in this browser only. No data
            was sent anywhere.
          </span>
        </div>
      )}

      <div className="claim-benefits">
        <p className="claim-benefits-title">Why claim your listing?</p>
        <ul>
          <li>Fix your information if anything is wrong.</li>
          <li>Add your hours, photos, and a description.</li>
          <li>Keep your listing accurate so customers find the right details.</li>
          <li>Stop anyone else from changing your page.</li>
        </ul>
      </div>

      {/* Customer-facing browse path, placed BELOW the claim callout on
          purpose (Arbo, 2026-09-18): an owner arriving to claim should see
          CTA -> why claim, not a row of competitors between those. */}
      {related.length > 0 && (
        <section className="related" aria-labelledby="related-heading">
          <h2 className="related-heading" id="related-heading">
            <Link to={`/category/${category?.slug ?? listing.category_slug}`}>
              More in {displayName(categoryName)}
            </Link>
          </h2>
          <ul className="related-grid">
            {related.map((l) => (
              <li key={l.slug}>
                <Link className="rel-card" to={`/listing/${l.slug}`}>
                  {l.image ? (
                    <img
                      className="rel-logo"
                      src={import.meta.env.BASE_URL + l.image.replace(/^\//, '')}
                      alt={`${l.business_name} logo`}
                    />
                  ) : (
                    <span className="rel-logo rel-logo-empty" aria-hidden="true" />
                  )}
                  <span className="rel-name">{l.business_name}</span>
                  {l.subcategory ? (
                    <span className="rel-sub">{l.subcategory}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
