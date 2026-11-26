import { cn, fullName, initials } from "../../utils/format";

const tones = ["tint-sky", "tint-violet", "tint-emerald", "tint-amber"];

const sizes = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-base",
};

function toneFor(value = "") {
  let total = 0;
  for (const char of value) total += char.charCodeAt(0);
  return tones[total % tones.length];
}

export default function Avatar({ student, name, src, size = "md", className = "" }) {
  const displayName = name || fullName(student) || "Utilisateur";
  const image = src || student?.avatarUrl;

  if (image) {
    return (
      <img
        src={image}
        alt={displayName}
        className={cn("shrink-0 overflow-hidden rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <span
      aria-label={displayName}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold leading-none tracking-tight",
        sizes[size],
        toneFor(displayName),
        className
      )}
    >
      {initials(displayName)}
    </span>
  );
}
