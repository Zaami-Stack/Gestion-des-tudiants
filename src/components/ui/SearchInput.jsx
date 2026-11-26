import { cn } from "../../utils/format";
import Button from "./Button";

export default function SearchInput({ value, onChange, placeholder = "Rechercher…", className = "" }) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field-base pr-20"
        aria-label={placeholder}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 !text-muted"
        >
          Effacer
        </Button>
      )}
    </div>
  );
}
