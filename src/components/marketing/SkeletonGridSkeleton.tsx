export function SkeletonGridSkeleton() {
  return (
    <section className="skeleton-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-box"
          style={{ height: "120px" }}
        />
      ))}
    </section>
  );
}
