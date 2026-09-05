import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { CopyPhone } from '../components/CopyPhone'

export function ListingDetail() {
  const { slug } = useParams<{ slug: string }>()
  const listing = LISTINGS.find((l) => l.slug === slug)
  const [reported, setReported] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const hasLongDesc = (listing?.description || '').length > 180

  if (!listing) {
    return (
      <div className="page">
        <h1 className="page-title">Listing not found</h1>
        <p>
          <Link to="/">Back to the directory</Link>
        </p>
      </div>
    )
  }

  const category = categoryBySlug(listing.category_slug)

  return (
    <div className="page">
      {listing.image && (
        <div className="detail-logo">
          <img src={import.meta.env.BASE_URL + listing.image.replace(/^\//, '')} alt={`${listing.business_name} logo`} />
        </div>
      )}
      <h1 className="page-title">{listing.business_name}</h1>
      <p className="listing-category">
        {category ? category.name : listing.category_slug}
        {listing.subcategory ? ` · ${listing.subcategory}` : ''}
      </p>
      <p className={`listing-desc${descExpanded ? ' is-expanded' : ''}`}>
        {listing.description}
      </p>
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
          <>
            <dt>Phone</dt>
            <dd>
              <CopyPhone phone={listing.phone} />
            </dd>
          </>
        )}
        {listing.email && (
          <>
            <dt>Email</dt>
            <dd>{listing.email}</dd>
          </>
        )}
        {listing.website && (
          <>
            <dt>Website</dt>
            <dd>
              <a href={listing.website} target="_blank" rel="noreferrer">
                {listing.website}
              </a>
            </dd>
          </>
        )}
        {listing.street_address && (
          <>
            <dt>Address</dt>
            <dd>
              {listing.street_address}, {listing.city}, {listing.state}{' '}
              {listing.zip_code ?? ''}
            </dd>
          </>
        )}
        {listing.hours && (
          <>
            <dt>Hours</dt>
            <dd>{listing.hours}</dd>
          </>
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
    </div>
  )
}
