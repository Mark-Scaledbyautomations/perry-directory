import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useListings } from '../data/useListings'
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

// All four filter values live in the URL (category, scope, website status,
// description type) plus the search box. Reading them from `?...=` on every
// render and writing changes back to the URL keeps the dropdowns, the count,
// and the address bar in lockstep, and makes refresh / back-forward / deep
// link behave identically. Before this, scope/status/desc were local state:
// silent, invisible, and still active after interactions, so combined counts
// read as "inaccurate" until a full refresh reset them.
function UrlFilter(props: { name: string; value: string; onChange: (v: string) => void; labels: [string, string][]; aria: string }) {
  return (
    <select
      className="category-filter"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      aria-label={props.aria}
    >
      {props.labels.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  )
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isAdmin = isAdminMode(searchParams)
  const [query, setQuery] = useState('')
  const [listings] = useListings()

  // URL-driven filter helpers. The update reads window.location.search at the
  // moment of the change, not the `searchParams` snapshot captured at render.
  // Two dropdown changes fired before React re-renders otherwise race: the
  // second overwrite drops the first's param (functional setSearchParams in
  // react-router v7 can still receive the same base when both calls resolve
  // into one navigation batch). That silently un-set a filter while others
  // stayed -- the exact "inaccurate until refresh" symptom. Reading the live
  // location makes each change start from the latest true state.
  const setParams = (updates: Record<string, string>) => {
    const p = new URLSearchParams(window.location.search)
    for (const [k, v] of Object.entries(updates)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    setSearchParams(p, { replace: true })
  }

  const category = searchParams.get('category') || ''
  const scope = searchParams.get('scope') || ''
  const websiteStatus = searchParams.get('status') || ''
  const descType = searchParams.get('desc') || ''

  const setCategory = (next: string) => setParams({ category: next })
  const setScope = (next: string) => setParams({ scope: next })
  const setWebsiteStatus = (next: string) => setParams({ status: next })
  const setDescType = (next: string) => setParams({ desc: next })

  // Which non-category filters are currently active (for chips + count text).
  const activeFilters: { label: string; clear: () => void }[] = []
  if (category) activeFilters.push({ label: categoryBySlug(category)?.name || category, clear: () => setCategory('') })
  if (scope) activeFilters.push({ label: SCOPE_LABEL[scope as keyof typeof SCOPE_LABEL], clear: () => setScope('') })
  if (websiteStatus) {
    const label =
      websiteStatus === 'ok' ? 'Site OK'
      : websiteStatus === 'none' ? 'No website'
      : WEBSITE_STATUS_LABEL[websiteStatus] || websiteStatus
    activeFilters.push({ label, clear: () => setWebsiteStatus('') })
  }
  if (descType) activeFilters.push({ label: DESCRIPTION_TYPE_LABEL[descType], clear: () => setDescType('') })
  const clearAll = () => setParams({ category: '', scope: '', status: '', desc: '' })

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return listings.filter((l) => {
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
  }, [query, category, scope, websiteStatus, descType, listings])

  return (
    <div className="page">
      <h1 className="page-title">Find a business in Perry</h1>
      {isAdmin && (
        <div className="adm-strip" role="status">
          {/* 2026-09-19 (Arbo): this banner reuses the /admin strip's UI
              (blue tag pill + note), replacing the old amber style. The
              dashboard entrance lives in the header nav (AdminNavCta);
              the exit link keeps its far-right spot. */}
          <span className="adm-tag">Admin mode</span>
          <p className="adm-note">This screen has review filters and visible badges.</p>
          <Link className="adm-exit" to="/directory?admin=0">
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
          <UrlFilter
            name="scope"
            value={scope}
            onChange={setScope}
            aria="Filter by listing scope"
            labels={[
              ['', 'All scopes'],
              ['local-independent', SCOPE_LABEL['local-independent']],
              ['local-franchisee', SCOPE_LABEL['local-franchisee']],
              ['corporate-location', SCOPE_LABEL['corporate-location']],
            ]}
          />
          <UrlFilter
            name="status"
            value={websiteStatus}
            onChange={setWebsiteStatus}
            aria="Filter by website status"
            labels={[
              ['', 'All website statuses'],
              ['ok', 'Site OK'],
              ['none', 'No website'],
              ['broken', WEBSITE_STATUS_LABEL.broken],
              ['domain-lost', WEBSITE_STATUS_LABEL['domain-lost']],
              ['rebranded', WEBSITE_STATUS_LABEL.rebranded],
              ['platform-link', WEBSITE_STATUS_LABEL['platform-link']],
            ]}
          />
          <UrlFilter
            name="desc"
            value={descType}
            onChange={setDescType}
            aria="Filter by description type"
            labels={[
              ['', 'All description types'],
              ['aeo', DESCRIPTION_TYPE_LABEL.aeo],
              ['plain', DESCRIPTION_TYPE_LABEL.plain],
            ]}
          />
        </div>
      )}
      {(activeFilters.length > 0 || query) && (
        <div className="active-filters" role="status">
          <span className="active-filters-lead">Showing results for:</span>
          {activeFilters.map((f) => (
            <button key={f.label} className="active-chip" type="button" onClick={f.clear} title="Clear this filter">
              {f.label} ×
            </button>
          ))}
          {query && (
            <button className="active-chip" type="button" onClick={() => setQuery('')} title="Clear search">
              "{query}" ×
            </button>
          )}
          <button className="active-clear-all" type="button" onClick={() => { clearAll(); setQuery('') }}>
            Clear all
          </button>
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
