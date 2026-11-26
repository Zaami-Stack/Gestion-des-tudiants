import { CountUp } from "./motion";

export default function StatCard({ label, value, detail, loading = false }) {
  if (loading) {
    return (
      <div className="surface h-[108px] p-5" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-surface-2" />
        <div className="mt-3 h-6 w-16 rounded bg-surface-2" />
        <div className="mt-2 h-2.5 w-32 rounded bg-surface-2" />
      </div>
    );
  }

  return (
    <article className="surface p-5">
      <p className="section-kicker">{label}</p>
      <p className="ios-value mt-3 text-[30px] leading-none text-ink">
        <CountUp value={value} />
      </p>
      <p className="mt-3 text-[12px] text-muted">{detail}</p>
    </article>
  );
}
