import { cn } from "../../utils/format";

const styles = {
  Actif: "bg-success/10 text-ink",
  "En attente": "bg-warning/10 text-ink",
  Inactif: "bg-surface-2 text-muted",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium leading-4", styles[status] || styles.Inactif, className)}>
      {status || "Inconnu"}
    </span>
  );
}
