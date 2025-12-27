export function SearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      autoFocus
      className="search-input"
      placeholder="Search or jump to a page…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
