import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { students, resetStudents } = useStudents();
  const notify = useToast();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const themes = [
    { id: "light", label: "Clair" },
    { id: "dark", label: "Sombre" },
  ];

  function confirmReset() {
    resetStudents();
    setConfirming(false);
    notify("Les données de démonstration ont été réinitialisées.", "info");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Préférences"
        title="Paramètres"
        description="Gérez votre accès, l'apparence de l'interface et les données locales de démonstration."
      />

      <div className="space-y-4">
        <section className="surface overflow-hidden">
          <header className="border-b border-line px-5 py-4 sm:px-6">
            <p className="section-kicker">Compte</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">{user?.name || "Utilisateur"}</h2>
            <p className="mt-1 text-[13px] text-muted">{user?.email || "admin@eduflow.fr"}</p>
          </header>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-muted">
              {user?.role || "Utilisateur"}
            </span>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </section>

        <section className="surface overflow-hidden">
          <header className="border-b border-line px-5 py-4 sm:px-6">
            <p className="section-kicker">Interface</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Apparence</h2>
          </header>
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[13px] leading-6 text-muted">Le choix est enregistré dans ce navigateur.</p>
            <div className="mt-4 grid max-w-sm grid-cols-2 gap-2">
              {themes.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={theme === item.id ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                  onClick={() => setTheme(item.id)}
                  aria-pressed={theme === item.id}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="surface overflow-hidden">
          <header className="border-b border-line px-5 py-4 sm:px-6">
            <p className="section-kicker">Stockage</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Données locales</h2>
          </header>
          <div className="px-5 py-4 sm:px-6">
            <div className="flex items-baseline gap-2">
              <p className="text-[24px] font-semibold leading-none tracking-[-0.02em] text-ink">{students.length}</p>
              <p className="text-[13px] text-muted">dossiers enregistrés</p>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-muted">
              {students.length} dossier{students.length > 1 ? "s" : ""} sont actuellement enregistrés dans ce navigateur. La réinitialisation restaure les dossiers de démonstration.
            </p>
            <Button variant="secondary" className="mt-4" onClick={() => setConfirming(true)}>
              Réinitialiser les données
            </Button>
          </div>
        </section>

        <section className="surface overflow-hidden">
          <header className="border-b border-line px-5 py-4 sm:px-6">
            <p className="section-kicker">À propos</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">À propos de la démonstration</h2>
          </header>
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[13px] leading-6 text-muted">
              L'authentification et la persistance sont simulées côté client. Les services sont isolés pour permettre un branchement ultérieur sur une API réelle sans modifier les écrans.
            </p>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Réinitialiser les données ?"
        description="Tous les dossiers créés dans ce navigateur seront remplacés par les dossiers de démonstration d'origine."
        confirmLabel="Réinitialiser"
        onCancel={() => setConfirming(false)}
        onConfirm={confirmReset}
      />
    </div>
  );
}
