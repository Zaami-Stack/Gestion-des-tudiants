import { cn } from "../../utils/format";

export default function Field({ label, htmlFor, required = false, error, hint, className = "", children }) {
  return (
    <div className={cn("min-w-0", className)}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] font-medium text-danger">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] leading-5 text-muted">{hint}</p>
      )}
    </div>
  );
}
