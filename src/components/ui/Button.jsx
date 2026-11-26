import { Link } from "react-router-dom";
import { buttonClass } from "./buttonStyles";

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  to,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const content = (
    <>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      ) : null}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClass(variant, size, className)} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...props}
      disabled={loading || props.disabled}
    >
      {content}
    </button>
  );
}
