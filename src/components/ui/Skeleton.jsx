export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="divide-y divide-line" aria-label="Chargement des données">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-surface-2" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 rounded bg-surface-2" />
            <div className="h-2.5 w-56 rounded bg-surface-2" />
          </div>
          <div className="hidden h-3 w-24 rounded bg-surface-2 sm:block" />
          <div className="hidden h-6 w-20 rounded-full bg-surface-2 md:block" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="surface p-5" aria-hidden="true">
      <div className="h-3 w-24 rounded bg-surface-2" />
      <div className="mt-4 h-7 w-16 rounded bg-surface-2" />
      <div className="mt-4 h-2.5 w-32 rounded bg-surface-2" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Chargement du tableau de bord">
      <div className="h-8 w-56 rounded bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <CardSkeleton key={item} />
        ))}
      </div>
      <div className="surface h-72" />
    </div>
  );
}
