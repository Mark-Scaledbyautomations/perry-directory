import { useMemo, useState } from 'react'
import { LISTINGS } from '../data/listings'
import { categoryBySlug } from '../data/categories'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { ListingCard } from '../components/ListingCard'

export function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LISTINGS.filter((l) => {
      if (category && l.category_slug !== category) return false
      if (!q) return true
      const catName = (categoryBySlug(l.category_slug)?.name || '').toLowerCase()
      return (
        l.business_name.toLowerCase().includes(q) ||
        l.category_slug.toLowerCase().includes(q) ||
        catName.includes(q) ||
        l.subcategory.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  return (
    <div className="page">
      <h1 className="page-title">Find a business in Perry</h1>
      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>
      <p className="result-count">{results.length} listing(s)</p>
      <div className="listing-grid">
        {results.map((l) => (
          <ListingCard key={l.listing_id} listing={l} />
        ))}
      </div>
    </div>
  )
}
