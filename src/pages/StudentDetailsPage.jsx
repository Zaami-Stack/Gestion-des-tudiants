import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";
import { formatDate, formatLongDate, fullName } from "../utils/format";

function DetailRow({ label, value, valueClassName = "" }) {
  return (
    <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl px-3 py-2.5 even:bg-surface-2/70">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className={`max-w-[65%] text-right text-[14px] font-medium text-ink ${valueClassName}`}>
        {value || "—"}
      </dd>
    </div>
  );
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useToast();
  const { students, loading, deleteStudent } = useStudents();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const student = students.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="surface h-96 p-5 sm:p-6" aria-label="Chargement du dossier">
        <div className="h-3 w-32 rounded bg-surface-2" />
        <div className="mt-5 h-8 w-64 max-w-full rounded bg-surface-2" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-9 rounded-xl bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="surface overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <p className="section-kicker">Annuaire</p>
        </div>
        <EmptyState
          title="Dossier introuvable"
          description="Ce dossier n'existe plus ou l'identifiant est incorrect."
          action={<Button to="/students" variant="secondary">Retour aux étudiants</Button>}
        />
      </div>
    );
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteStudent(student.id);
      notify(`${fullName(student)} a été supprimé.`, "info");
      navigate("/students", { replace: true });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button to="/students" variant="secondary" size="sm">Retour aux étudiants</Button>

      <PageHeader
        eyebrow="Dossier"
        title={fullName(student)}
        description={`Dossier ${student.studentId}`}
        actions={
          <>
            <Button to={`/students/edit/${student.id}`} variant="secondary">Modifier</Button>
            <Button variant="danger" onClick={() => setConfirming(true)}>Supprimer</Button>
          </>
        }
      />

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <p className="section-kicker">Aperçu</p>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={student.status} />
            <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-muted">{student.field}</span>
            <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-muted">{student.className}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface overflow-hidden">
          <header className="px-5 py-4 sm:px-6">
            <p className="section-kicker">Profil</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Informations personnelles</h2>
          </header>
          <dl className="space-y-1 px-4 py-4 sm:px-5">
            <DetailRow label="Nom complet" value={fullName(student)} />
            <DetailRow label="Date de naissance" value={formatLongDate(student.dateOfBirth)} />
            <DetailRow label="Genre" value={student.gender} />
            <DetailRow label="Téléphone" value={student.phone} />
            <DetailRow label="Email" value={student.email} />
            <DetailRow label="Adresse" value={student.address} />
          </dl>
        </section>

        <section className="surface overflow-hidden">
          <header className="px-5 py-4 sm:px-6">
            <p className="section-kicker">Scolarité</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Parcours scolaire</h2>
          </header>
          <dl className="space-y-1 px-4 py-4 sm:px-5">
            <DetailRow label="Numéro étudiant" value={student.studentId} />
            <DetailRow label="Filière" value={student.field} />
            <DetailRow label="Classe" value={student.className} />
            <DetailRow label="Date d'inscription" value={formatLongDate(student.enrollmentDate)} />
            <DetailRow label="Statut" value={student.status} />
            <DetailRow label="Dossier créé le" value={formatDate(student.createdAt, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
          </dl>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Supprimer ce dossier ?"
        description={`Le dossier de ${fullName(student)} sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
