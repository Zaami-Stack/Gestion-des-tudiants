import Button from "./Button";
import { cn } from "../../utils/format";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({ compact = false, className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? "sm" : "md"}
      onClick={toggleTheme}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={cn("!font-medium !text-muted", className)}
    >
      {isDark ? "Mode clair" : "Mode sombre"}
    </Button>
  );
}
