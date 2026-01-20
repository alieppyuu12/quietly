export function FeatureCardSkeleton() {
  return (
    <section className="feature-large">
      <div
        className="skeleton skeleton-text skeleton-text-lg"
        style={{ marginBottom: "16px" }}
      />
      <div className="skeleton skeleton-text skeleton-text-md" />
      <div className="skeleton skeleton-text skeleton-text-md" />
      <div
        className="skeleton skeleton-text skeleton-text-md"
        style={{ width: "80%" }}
      />
    </section>
  );
}
