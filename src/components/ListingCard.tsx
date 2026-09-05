import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Listing } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { CopyPhone } from './CopyPhone'

// Admin-only scope badge. The app has no login, so "admin" is a hidden URL
// flag (?admin=1). A normal visitor never sees the badge; we do by adding the
// flag. This is a review aid, not real authentication. Once seen, the flag is
// pinned in sessionStorage so in-app navigation (which drops the query string)
// keeps admin mode on for the rest of the tab.
const ADMIN_KEY = 'pbd-admin'

export function isAdminMode(searchParams: { get(name: string): string | null }): boolean {
  if (searchParams.get('admin') === '1') {
    sessionStorage.setItem(ADMIN_KEY, '1')
    return true
  }
  if (searchParams.get('admin') === '0') {
    sessionStorage.removeItem(ADMIN_KEY)
    return false
  }
  return sessionStorage.getItem(ADMIN_KEY) === '1'
}

const SCOPE_LABEL: Record<Listing['listing_scope'], string> = {
  'local-independent': 'Local',
  'local-franchisee': 'Franchisee',
  'corporate-location': 'Corporate',
}

const WEBSITE_STATUS_LABEL: Record<string, string> = {
  broken: 'Site broken',
  repurposed: 'Site repurposed',
}

export function ListingCard({ listing }: { listing: Listing }) {
  const category = categoryBySlug(listing.category_slug)
  const [expanded, setExpanded] = useState(false)
  const hasLongDesc = (listing.description || '').length > 180
  const [searchParams] = useSearchParams()
  const isAdmin = isAdminMode(searchParams)

  return (
    <div className="listing-card">
      {listing.image && (
        <div className="listing-logo">
          <img src={listing.image} alt={`${listing.business_name} logo`} loading="lazy" />
        </div>
      )}
      <div className="listing-card-head">
        <h3 className="listing-name">
          <Link className="listing-card-link" to={`/listing/${listing.slug}`}>
            {listing.business_name}
          </Link>
        </h3>
        {listing.listing_tier === 'premium' && (
          <span className="badge badge-premium">Premium</span>
        )}
        {isAdmin && listing.listing_scope !== 'local-independent' && (
          <span className={`badge badge-scope badge-scope-${listing.listing_scope}`}>
            {SCOPE_LABEL[listing.listing_scope]}
          </span>
        )}
        {isAdmin && listing.website_status && (
          <span className={`badge badge-website badge-website-${listing.website_status}`}>
            {WEBSITE_STATUS_LABEL[listing.website_status]}
          </span>
        )}
      </div>
      <p className="listing-category">
        {category ? category.name : listing.category_slug}
        {listing.subcategory ? ` · ${listing.subcategory}` : ''}
      </p>
      {listing.description && (
        <>
          <p className={`listing-desc${expanded ? ' is-expanded' : ''}`}>
            {listing.description}
          </p>
          {hasLongDesc && (
            <button
              className="see-more"
              type="button"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </>
      )}
      {listing.phone && (
        <p className="listing-phone">
          <CopyPhone phone={listing.phone} />
        </p>
      )}
      {listing.website && (
        <p className="listing-web">
          <a href={listing.website} target="_blank" rel="noreferrer">
            {listing.website}
          </a>
        </p>
      )}
    </div>
  )
}
