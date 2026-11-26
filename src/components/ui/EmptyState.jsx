export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[14px] leading-6 text-muted">{description}</p>}
      {action && <div className="mt-6 flex w-full justify-center">{action}</div>}
    </div>
  );
}
