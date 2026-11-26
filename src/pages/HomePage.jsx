import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBarChart2, FiCheck, FiSearch, FiUsers } from "react-icons/fi";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import ThemeToggle from "../components/ui/ThemeToggle";
import { CountUp } from "../components/ui/motion";
import { staggerContainer, staggerItem } from "../components/ui/presets";
import { useStudents } from "../hooks/useStudents";
import { fullName, initials, recentMonthBuckets } from "../utils/format";

const features = [
  {
    icon: FiUsers,
    title: "Annuaire structuré",
    text: "Identité, contact, parcours et statut réunis dans un dossier clair, sans information superflue.",
  },
  {
    icon: FiSearch,
    title: "Recherche instantanée",
    text: "Retrouvez un étudiant par nom, email ou numéro, puis affinez avec des filtres simples.",
  },
  {
    icon: FiBarChart2,
    title: "Indicateurs fiables",
    text: "Effectifs, répartition et inscriptions calculés directement depuis les dossiers enregistrés.",
  },
];

const highlights = ["Données locales", "Interface rapide", "Mode sombre inclus"];

export default function HomePage() {
  const { students } = useStudents();
  const active = students.filter((student) => student.status === "Actif").length;
  const pending = students.filter((student) => student.status === "En attente").length;
  const fields = new Set(students.map((student) => student.field)).size;
  const recent = [...students].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  const monthly = useMemo(() => {
    const buckets = recentMonthBuckets(6);
    students.forEach((student) => {
      const key = student.enrollmentDate?.slice(0, 7);
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [students]);

  const maxMonthly = Math.max(1, ...monthly.map((item) => item.count));
  const peakIndex = monthly.reduce((best, item, index) => (item.count > monthly[best].count ? index : best), 0);

  const stats = [
    { label: "Dossiers", hint: "enregistrés", value: students.length, icon: FiUsers },
    { label: "Actifs", hint: "en cours", value: active, icon: FiCheck },
    { label: "En attente", hint: "à traiter", value: pending, icon: FiSearch },
    { label: "Filières", hint: "représentées", value: fields, icon: FiBarChart2 },
  ];

  return (
    <div className="min-h-screen bg-canvas pt-[env(safe-area-inset-top)]">
      <header className="sticky top-[env(safe-area-inset-top)] z-40 border-b border-line bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5 sm:px-8">
          <Logo compact />
          <nav className="hidden items-center gap-5 md:flex" aria-label="Navigation publique">
            <a href="#apercu" className="text-[13px] font-medium text-muted">Aperçu</a>
            <a href="#fonctionnalites" className="text-[13px] font-medium text-muted">Fonctionnalités</a>
            <Link to="/students" className="text-[13px] font-medium text-muted">Annuaire</Link>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link to="/login" className="text-[13px] font-medium text-muted">Connexion</Link>
            <Button to="/register" size="sm">Commencer</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line bg-surface">
          <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-[#5e5ce6]/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/70 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Gestion étudiante, version claire
              </div>
              <h1 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
                L'essentiel, <span className="bg-linear-to-r from-accent to-[#5e5ce6] bg-clip-text text-transparent">sans le bruit.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-muted">
                Dossiers, inscriptions et indicateurs réunis dans une interface claire, conçue pour durer.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Button to="/dashboard" size="lg">
                  Ouvrir le tableau de bord
                  <FiArrowRight size={15} aria-hidden="true" />
                </Button>
                <Link
                  to="/students"
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-line bg-surface px-4 text-[13px] font-semibold text-ink"
                >
                  Explorer l'annuaire
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-muted">
                {highlights.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <FiCheck size={13} className="text-accent" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div id="apercu" className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_30px_90px_-40px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-4 py-3 sm:px-5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                  <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                  <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                </div>
                <p className="text-[12px] font-medium text-muted">eduflow / aperçu</p>
                <p className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  En direct
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-line border-b border-line sm:grid-cols-4">
                {stats.map(({ label, hint, value, icon: Icon }) => (
                  <div key={label} className="px-4 py-4 sm:px-5">
                    <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-accent-soft text-accent">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <p className="ios-value mt-2.5 text-[22px] leading-none text-ink"><CountUp value={value} /></p>
                    <p className="mt-1 text-[11px] font-medium text-ink">{label}</p>
                    <p className="text-[10px] text-muted">{hint}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-line px-5 py-5 sm:px-5 lg:border-b-0 lg:border-r">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="section-kicker">Inscriptions</p>
                      <p className="mt-1 text-[13px] font-semibold text-ink">6 derniers mois</p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">Tendance</span>
                  </div>
                  <div className="relative mt-6">
                    <div className="pointer-events-none absolute inset-x-0 bottom-5 top-0 flex flex-col justify-between" aria-hidden="true">
                      {[0, 1, 2].map((line) => <div key={line} className="border-t border-dashed border-line" />)}
                    </div>
                    <div className="relative flex h-24 items-end gap-2 sm:gap-3">
                      {monthly.map((item, index) => (
                        <div key={item.key} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                          <p className="text-center text-[10px] font-semibold text-ink"><CountUp value={item.count} /></p>
                          <div className="relative flex h-full items-end">
                            <div
                              className={`w-full rounded-t-lg ${index === peakIndex ? "bg-linear-to-t from-accent to-accent/70" : "bg-surface-2"}`}
                              style={{ height: `${Math.max(6, (item.count / maxMonthly) * 100)}%` }}
                              title={`${item.count} inscription${item.count > 1 ? "s" : ""}`}
                            />
                          </div>
                          <p className="text-center text-[10px] font-medium uppercase tracking-wide text-muted">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-5">
                    <p className="section-kicker">Dossiers récents</p>
                    <Button to="/students" variant="ghost" size="sm">Tout voir</Button>
                  </div>
                  <div className="border-t border-line">
                    {recent.map((student) => (
                      <Link
                        key={student.id}
                        to={`/students/${student.id}`}
                        className="ios-row flex items-center gap-3 border-b border-line px-5 py-3 last:border-b-0 sm:px-5"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                          {initials(fullName(student))}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-ink">{fullName(student)}</span>
                          <span className="block truncate text-[11px] text-muted">{student.studentId} · {student.field}</span>
                        </span>
                        <StatusBadge status={student.status} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker">Fonctionnalités</p>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">
              Tout ce qu'il faut. Rien de superflu.
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-muted">
              Une interface pensée pour un usage quotidien : lisible sur mobile, rapide sur desktop, cohérente partout.
            </p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 grid gap-3 md:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  variants={staggerItem}
                  className="surface relative overflow-hidden p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-accent-soft text-accent">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums text-muted">0{index + 1}</span>
                  </div>
                  <h3 className="relative mt-4 text-[15px] font-semibold leading-snug text-ink">{feature.title}</h3>
                  <p className="relative mt-2 text-[13px] leading-6 text-muted">{feature.text}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:pb-20">
          <div className="relative overflow-hidden rounded-[24px] bg-solid px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#5e5ce6]/20 blur-3xl" />
            <div className="relative">
              <p className="section-kicker !text-white/60">Prêt à commencer ?</p>
              <h2 className="mx-auto mt-3 max-w-2xl text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[32px]">
                Un annuaire clair, à portée de main.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[13px] leading-6 text-white/65">
                Ouvrez le tableau de bord et retrouvez vos étudiants en quelques secondes.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Button to="/dashboard" size="lg">
                  Ouvrir le tableau de bord
                  <FiArrowRight size={15} aria-hidden="true" />
                </Button>
                <Link to="/register" className="inline-flex h-10 items-center rounded-[10px] px-4 text-[13px] font-semibold text-white/80">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-5 text-center text-[12px] text-muted sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <span>© 2026 EduFlow</span>
          <div className="flex items-center gap-3">
            <span>Démonstration locale · Données persistantes</span>
            <ThemeToggle compact />
          </div>
        </div>
      </footer>
    </div>
  );
}
