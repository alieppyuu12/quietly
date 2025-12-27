export function HomeSkeleton() {
  return (
    <main className="home">
      <div className="home-header">
        <div className="skeleton title" />
        <div className="skeleton subtitle" />
      </div>

      <div className="home-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton card" />
        ))}
      </div>
    </main>
  )
}
