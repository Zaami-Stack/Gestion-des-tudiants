import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { CountUp } from "../components/ui/motion";
import { useStudents } from "../hooks/useStudents";
import { fullName, recentMonthBuckets } from "../utils/format";

export default function DashboardPage() {
  const { students, loading } = useStudents();

  const stats = useMemo(() => {
    const active = students.filter((student) => student.status === "Actif").length;
    const pending = students.filter((student) => student.status === "En attente").length;
    return { active, pending, fields: new Set(students.map((student) => student.field)).size };
  }, [students]);

  const monthly = useMemo(() => {
    const buckets = recentMonthBuckets(6);
    students.forEach((student) => {
      const key = student.enrollmentDate?.slice(0, 7);
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [students]);

  const fieldCounts = useMemo(() => {
    const counts = new Map();
    students.forEach((student) => counts.set(student.field, (counts.get(student.field) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [students]);

  const recent = useMemo(
    () => [...students].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [students]
  );

  if (loading) return <DashboardSkeleton />;

  const maxMonthly = Math.max(1, ...monthly.map((item) => item.count));
  const peakIndex = monthly.findIndex((item) => item.count === maxMonthly && item.count > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        description="Une lecture claire des effectifs et des inscriptions, calculée à partir des dossiers enregistrés."
        actions={<Button to="/students/add" variant="primary">Ajouter un étudiant</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Étudiants" value={students.length} detail="Dossiers enregistrés" />
        <StatCard label="Actifs" value={stats.active} detail="Suivi en cours" />
        <StatCard label="En attente" value={stats.pending} detail="Dossiers à traiter" />
        <StatCard label="Filières" value={stats.fields} detail="Formations représentées" />
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold leading-snug text-ink">Inscriptions</h2>
              <p className="mt-1 text-[12px] text-muted">Basées sur les dates d'inscription des dossiers.</p>
            </div>
            <p className="text-[12px] text-muted">6 derniers mois</p>
          </div>
          <div className="mt-7 flex h-40 items-end gap-2 px-2 pt-3 sm:gap-4">
            {monthly.map((item, index) => (
              <div key={item.key} className="flex h-full flex-1 flex-col justify-end gap-2">
                <p className="text-center text-[12px] font-semibold text-ink"><CountUp value={item.count} /></p>
                <div className="relative flex h-full items-end">
                  <div
                    className={`w-full rounded-t-lg ${index === peakIndex ? "bg-accent" : "bg-surface-2"}`}
                    style={{ height: `${Math.max(4, (item.count / maxMonthly) * 100)}%` }}
                    title={`${item.count} inscription${item.count > 1 ? "s" : ""}`}
                  />
                </div>
                <p className="text-center text-[11px] text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5 sm:p-6">
          <h2 className="text-[16px] font-semibold leading-snug text-ink">Répartition</h2>
          <p className="mt-1 text-[12px] text-muted">{students.length} dossier{students.length > 1 ? "s" : ""} au total</p>
          <div className="mt-6 space-y-5">
            {fieldCounts.map(([field, count]) => {
              const percentage = students.length ? Math.round((count / students.length) * 100) : 0;
              return (
                <div key={field}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[12px]">
                    <span className="truncate font-medium text-ink">{field}</span>
                    <span className="shrink-0 text-muted">{count} · {percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-ink/25" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
            {fieldCounts.length === 0 && <p className="text-[12px] text-muted">Aucune filière à afficher.</p>}
          </div>
        </section>
      </section>

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[16px] font-semibold leading-snug text-ink">Dossiers récents</h2>
            <p className="mt-1 text-[12px] text-muted">Les derniers dossiers ajoutés au répertoire.</p>
          </div>
          <Button to="/students" variant="ghost" size="sm">Tout voir</Button>
        </div>
        <div className="divide-y divide-line">
          {recent.map((student) => (
            <Link
              key={student.id}
              to={`/students/${student.id}`}
              className="ios-row flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
            >
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-medium text-ink">{fullName(student)}</span>
                <span className="block truncate text-[12px] text-muted">{student.studentId} · {student.field} · {student.className}</span>
              </span>
              <StatusBadge status={student.status} />
            </Link>
          ))}
          {recent.length === 0 && <p className="px-6 py-10 text-center text-[12px] text-muted">Aucun dossier à afficher.</p>}
        </div>
      </section>
    </div>
  );
}
