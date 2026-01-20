export function ValueGridSkeleton() {
  return (
    <section className="value-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card">
          <div
            className="skeleton skeleton-text skeleton-text-lg"
            style={{ marginBottom: "8px" }}
          />
          <div className="skeleton skeleton-text skeleton-text-md" />
          <div
            className="skeleton skeleton-text skeleton-text-md"
            style={{ width: "90%" }}
          />
        </div>
      ))}
    </section>
  );
}
