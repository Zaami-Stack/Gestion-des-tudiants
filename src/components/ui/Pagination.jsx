import { cn } from "../../utils/format";
import Button from "./Button";

export default function Pagination({ page, totalPages, total = 0, pageSize = 8, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-5">
      <p className="text-[13px] text-muted">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} sur <span className="font-semibold text-ink">{total}</span>
      </p>
      <nav className="flex flex-wrap items-center gap-1 rounded-[14px] bg-surface-2 p-1" aria-label="Pagination">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="min-w-11 !text-muted"
        >
          Précédent
        </Button>
        {pages.map((number, index) => (
          <span key={number} className="flex items-center gap-0.5">
            {index > 0 && number - pages[index - 1] > 1 && <span className="px-1.5 text-[13px] text-muted">…</span>}
            <Button
              type="button"
              variant={number === page ? "subtle" : "ghost"}
              size="sm"
              onClick={() => onChange(number)}
              aria-current={number === page ? "page" : undefined}
              className={cn("min-w-11", number !== page && "!text-muted")}
            >
              {number}
            </Button>
          </span>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="min-w-11 !text-muted"
        >
          Suivant
        </Button>
      </nav>
    </div>
  );
}
