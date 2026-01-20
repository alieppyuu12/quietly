export function SupportingGridSkeleton() {
  return (
    <section className="supporting-grid">
      {Array.from({ length: 3 }).map((_, i) => (
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
