import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { ListingCard, isAdminMode, SCOPE_LABEL, WEBSITE_STATUS_LABEL } from '../components/ListingCard'

export function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [scope, setScope] = useState('')
  const [websiteStatus, setWebsiteStatus] = useState('')
  const [searchParams] = useSearchParams()
  const isAdmin = isAdminMode(searchParams)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LISTINGS.filter((l) => {
      if (category && l.category_slug !== category) return false
      if (scope && l.listing_scope !== scope) return false
      if (websiteStatus && l.website_status !== websiteStatus) return false
      if (!q) return true
      const catName = (categoryBySlug(l.category_slug)?.name || '').toLowerCase()
      return (
        l.business_name.toLowerCase().includes(q) ||
        l.category_slug.toLowerCase().includes(q) ||
        catName.includes(q) ||
        l.subcategory.toLowerCase().includes(q)
      )
    })
  }, [query, category, scope, websiteStatus])

  return (
    <div className="page">
      <h1 className="page-title">Find a business in Perry</h1>
      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>
      {isAdmin && (
        <div className="toolbar admin-toolbar">
          <select
            className="category-filter"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            aria-label="Filter by listing scope"
          >
            <option value="">All scopes</option>
            <option value="local-franchisee">{SCOPE_LABEL['local-franchisee']}</option>
            <option value="corporate-location">{SCOPE_LABEL['corporate-location']}</option>
          </select>
          <select
            className="category-filter"
            value={websiteStatus}
            onChange={(e) => setWebsiteStatus(e.target.value)}
            aria-label="Filter by website status"
          >
            <option value="">All website statuses</option>
            <option value="broken">{WEBSITE_STATUS_LABEL.broken}</option>
            <option value="domain-lost">{WEBSITE_STATUS_LABEL['domain-lost']}</option>
            <option value="rebranded">{WEBSITE_STATUS_LABEL.rebranded}</option>
          </select>
        </div>
      )}
      <p className="result-count">{results.length} listing(s)</p>
      <div className="listing-grid">
        {results.map((l) => (
          <ListingCard key={l.listing_id} listing={l} />
        ))}
      </div>
    </div>
  )
}
