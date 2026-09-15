import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { ListingCard, isAdminMode, SCOPE_LABEL, WEBSITE_STATUS_LABEL, DESCRIPTION_TYPE_LABEL } from '../components/ListingCard'
import { isAeoDescription } from '../components/DescriptionBlock'

// Crude plural/agent stems so "plumber" matches "Plumbing" and "restaurants"
// matches "restaurant". Returns the word plus each plausible stem (agent
// suffix "plumber" -> "plumb", plural "plumbers" -> "plumber"), so the matcher
// can accept any of them. Guarded so a short word ("s", "es", "llc") never
// stems to an empty string, which would match every listing.
function stems(word: string): string[] {
  if (word.length <= 2) return [word]
  const out = [word]
  for (const suf of ['ers', 'ors', 'er', 'or', 'ings', 'ing', 'es', 's']) {
    if (word.endsWith(suf)) {
      const cand = word.slice(0, word.length - suf.length)
      if (cand.length >= 2 && !out.includes(cand)) out.push(cand)
      break // strip one suffix class only: "plumber" -> "plumb", not "plumbe"
    }
  }
  return out
}

// Words a visitor types that carry no search meaning on their own. Without
// this, "the" matches 19 listings (substring inside "Theatre") and "of"
// matches 127, which reads as an inaccurate count. These are matched as whole
// words only in names, so excluding them from the query loses nothing.
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for',
  'is', 'it', 'by', 'with', 'near', 'me', 'my', 'i', 'we',
])

// Split a string into lowercase word tokens (letters/digits only), so matching
// happens on word boundaries instead of raw substrings. This stops "tire" from
// matching "Retirement" and "the" from matching "Theatre".
function tokens(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
}

export function Home() {
  const [searchParams] = useSearchParams()
  const isAdmin = isAdminMode(searchParams)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [scope, setScope] = useState('')
  const [websiteStatus, setWebsiteStatus] = useState('')
  const [descType, setDescType] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LISTINGS.filter((l) => {
      if (category && l.category_slug !== category) return false
      if (scope && l.listing_scope !== scope) return false
      if (websiteStatus === 'none') {
        if (l.website) return false
      } else if (websiteStatus === 'ok') {
        if (!l.website || l.website_status) return false
      } else if (websiteStatus && l.website_status !== websiteStatus) return false
      if (descType) {
        const isAeo = l.description ? isAeoDescription(l.description) : false
        if (descType === 'aeo' && !isAeo) return false
        if (descType === 'plain' && isAeo) return false
      }
      if (!q) return true
      const catName = (categoryBySlug(l.category_slug)?.name || '').toLowerCase()
      // Tokenize the haystack on word boundaries so a query word has to match a
      // whole field word, not a substring inside an unrelated word ("tire" in
      // "Retirement").
      const hayTokens = tokens(`${l.business_name} ${l.category_slug} ${catName} ${l.subcategory}`)
      // Query words: drop stop words. If the query is ALL stop words ("the"),
      // treat it as no-query rather than matching everything or nothing.
      const words = q
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
        .filter((w) => !STOP_WORDS.has(w))
      if (words.length === 0) return true
      return words.every((w) =>
        hayTokens.some(
          (t) =>
            stems(w).some((s) => t === s || (s.length >= 4 && t.startsWith(s))) ||
            // Prefix match on the raw query too, so "dent" finds "dental".
            (w.length >= 4 && t.startsWith(w)),
        ),
      )
    })
  }, [query, category, scope, websiteStatus, descType])

  return (
    <div className="page">
      <h1 className="page-title">Find a business in Perry</h1>
      {isAdmin && (
        <div className="admin-banner" role="status">
          <span>
            <strong>Admin mode</strong>: review filters and badges are visible.
          </span>
          <Link className="admin-exit" to="/directory?admin=0">
            Exit admin mode
          </Link>
        </div>
      )}
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
            <option value="local-independent">{SCOPE_LABEL['local-independent']}</option>
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
            <option value="ok">Site OK</option>
            <option value="none">No website</option>
            <option value="broken">{WEBSITE_STATUS_LABEL.broken}</option>
            <option value="domain-lost">{WEBSITE_STATUS_LABEL['domain-lost']}</option>
            <option value="rebranded">{WEBSITE_STATUS_LABEL.rebranded}</option>
            <option value="platform-link">{WEBSITE_STATUS_LABEL['platform-link']}</option>
          </select>
          <select
            className="category-filter"
            value={descType}
            onChange={(e) => setDescType(e.target.value)}
            aria-label="Filter by description type"
          >
            <option value="">All description types</option>
            <option value="aeo">{DESCRIPTION_TYPE_LABEL.aeo}</option>
            <option value="plain">{DESCRIPTION_TYPE_LABEL.plain}</option>
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
