import { cn } from "../../utils/format";

export default function PageHeader({ eyebrow, title, description, actions, className = "" }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h1 className="font-display mt-2 text-[24px] leading-[1.15] text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{actions}</div>}
    </div>
  );
}
