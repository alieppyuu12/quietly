export function FinalCTASkeleton() {
  return (
    <section style={{ marginTop: "120px" }}>
      <div
        className="skeleton skeleton-text skeleton-text-lg"
        style={{ marginBottom: "32px" }}
      />
      <div
        className="skeleton skeleton-text skeleton-text-md"
        style={{ marginBottom: "16px" }}
      />
      <div
        className="skeleton skeleton-text skeleton-text-md"
        style={{ marginBottom: "32px", width: "85%", margin: "0 auto 32px" }}
      />

      <div className="final-cta">
        <div className="skeleton skeleton-button" />
        <div className="skeleton skeleton-button" />
      </div>
    </section>
  );
}
