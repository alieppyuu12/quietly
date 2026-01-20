export function HeroSkeleton() {
  return (
    <section className="hero">
      <div className="skeleton skeleton-text skeleton-text-lg" />
      <div className="skeleton skeleton-text skeleton-text-lg" />

      <div
        className="skeleton skeleton-text skeleton-text-md"
        style={{ marginTop: "16px" }}
      />
      <div className="skeleton skeleton-text skeleton-text-md" />
      <div
        className="skeleton skeleton-text skeleton-text-md"
        style={{ width: "80%", margin: "0 auto" }}
      />

      <div className="hero-cta" style={{ marginTop: "24px" }}>
        <div className="skeleton skeleton-button" />
        <div className="skeleton skeleton-button" />
      </div>

      <div
        className="skeleton skeleton-text skeleton-text-sm"
        style={{ marginTop: "16px", width: "60%", margin: "16px auto 0" }}
      />
    </section>
  );
}
