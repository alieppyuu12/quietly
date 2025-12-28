export function SkeletonGrid() {
  return (
    <section className="skeleton-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-box" />
      ))}
    </section>
  )
}
