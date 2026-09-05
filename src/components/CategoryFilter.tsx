import { CATEGORIES } from '../data/categories'

interface CategoryFilterProps {
  value: string
  onChange: (next: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <select
      className="category-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All categories</option>
      {CATEGORIES.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
