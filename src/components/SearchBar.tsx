interface SearchBarProps {
  value: string
  onChange: (next: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Search by name or category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
