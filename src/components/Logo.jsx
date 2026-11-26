import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="inline-flex h-9 items-center rounded-xl px-1 text-ink" aria-label="EduFlow, accueil">
      <span className={`brand-mark ${compact ? "text-[15px]" : "text-[16px]"}`}>
        EduFlow
      </span>
    </Link>
  );
}
