// Type definitions for the directory listings. Generated from
// projects/perry-directory/data/perry-businesses.csv (278 records).
// The data itself lives in public/listings.json and is fetched at
// runtime via useListings(); this file carries only the types.
// Regenerate with: python scripts/gen_listings.py

export type ListingTier = 'free' | 'premium'
export type ClaimStatus = 'unclaimed' | 'claimed'
export type ListingScope = 'local-independent' | 'local-franchisee' | 'corporate-location'
export type WebsiteStatus = '' | 'broken' | 'domain-lost' | 'rebranded' | 'platform-link'

export interface Listing {
  listing_id: string
  business_name: string
  slug: string
  category_slug: string
  subcategory: string
  description: string
  phone: string | null
  email: string | null
  website: string | null
  street_address: string | null
  city: string
  state: string
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  hours: string | null
  image: string | null
  tags: string[]
  listing_tier: ListingTier
  claim_status: ClaimStatus
  listed_since: string
  data_source: string
  listing_scope: ListingScope
  website_status: WebsiteStatus
}
