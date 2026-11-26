import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Field from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";
import { CLASSES, FIELDS, GENDERS, STATUSES } from "../utils/constants";
import { fullName, nextStudentId } from "../utils/format";
import { validateStudent } from "../utils/validate";

function emptyForm(students = []) {
  return {
    avatarUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    gender: GENDERS[0],
    field: FIELDS[0],
    className: CLASSES[0],
    enrollmentDate: new Date().toISOString().slice(0, 10),
    status: STATUSES[0],
    studentId: nextStudentId(students),
  };
}

function toForm(student) {
  return {
    avatarUrl: student.avatarUrl || "",
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    email: student.email || "",
    phone: student.phone || "",
    dateOfBirth: student.dateOfBirth || "",
    address: student.address || "",
    gender: student.gender || GENDERS[0],
    field: student.field || FIELDS[0],
    className: student.className || CLASSES[0],
    enrollmentDate: student.enrollmentDate || new Date().toISOString().slice(0, 10),
    status: student.status || STATUSES[0],
    studentId: student.studentId || "",
  };
}

export default function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useToast();
  const { students, loading, createStudent, updateStudent } = useStudents();
  const existing = id ? students.find((student) => student.id === id) : null;
  const [form, setForm] = useState(() => (existing ? toForm(existing) : emptyForm(students)));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="surface h-96 p-5 sm:p-6" aria-label="Chargement du formulaire">
        <div className="h-3 w-28 rounded bg-surface-2" />
        <div className="mt-5 h-8 w-72 max-w-full rounded bg-surface-2" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-9 rounded-xl bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  if (id && !existing) {
    return (
      <div className="surface overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <p className="section-kicker">Annuaire</p>
        </div>
        <EmptyState
          title="Dossier introuvable"
          description="Le dossier que vous souhaitez modifier n'existe plus."
          action={<Button to="/students" variant="secondary">Retour aux étudiants</Button>}
        />
      </div>
    );
  }

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateStudent(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      if (existing) {
        await updateStudent(existing.id, form);
        notify("Le dossier a été mis à jour.");
        navigate(`/students/${existing.id}`, { replace: true });
      } else {
        const created = await createStudent(form);
        notify("L'étudiant a été ajouté avec succès.");
        navigate(`/students/${created.id}`, { replace: true });
      }
    } catch (error) {
      notify(error.message || "Une erreur est survenue.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button to="/students" variant="secondary" size="sm">Retour aux étudiants</Button>

      <PageHeader
        eyebrow="Formulaire"
        title={existing ? "Modifier le dossier" : "Ajouter un étudiant"}
        description={existing ? "Mettez à jour les informations de ce dossier." : "Renseignez les informations pour créer un nouveau dossier."}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <form onSubmit={submit} noValidate className="surface overflow-hidden lg:col-span-2">
          <header className="px-5 pb-3 pt-5 sm:px-6">
            <p className="section-kicker">Dossier</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Dossier étudiant</h2>
            <p className="mt-1 text-[13px] text-muted">Les champs marqués d'un * sont obligatoires.</p>
          </header>

          <div className="space-y-10 p-5 sm:p-6">
            <section>
              <p className="section-kicker">Profil</p>
              <h3 className="mt-1 text-[17px] font-semibold leading-tight text-ink">Identité et contact</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Prénom" htmlFor="firstName" required error={errors.firstName}>
                  <input id="firstName" name="firstName" value={form.firstName} onChange={update} placeholder="Amina" className="field-base" aria-invalid={Boolean(errors.firstName)} />
                </Field>
                <Field label="Nom" htmlFor="lastName" required error={errors.lastName}>
                  <input id="lastName" name="lastName" value={form.lastName} onChange={update} placeholder="Benali" className="field-base" aria-invalid={Boolean(errors.lastName)} />
                </Field>
                <Field label="Email" htmlFor="email" required error={errors.email}>
                  <input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="amina@exemple.fr" className="field-base" aria-invalid={Boolean(errors.email)} />
                </Field>
                <Field label="Téléphone" htmlFor="phone" required error={errors.phone}>
                  <input id="phone" name="phone" value={form.phone} onChange={update} placeholder="+213 555 000 000" className="field-base" aria-invalid={Boolean(errors.phone)} />
                </Field>
                <Field label="Date de naissance" htmlFor="dateOfBirth" required error={errors.dateOfBirth}>
                  <input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} className="field-base" aria-invalid={Boolean(errors.dateOfBirth)} />
                </Field>
                <Field label="Genre" htmlFor="gender" error={errors.gender}>
                  <select id="gender" name="gender" value={form.gender} onChange={update} className="field-base">
                    {GENDERS.map((gender) => <option key={gender}>{gender}</option>)}
                  </select>
                </Field>
                <Field label="Adresse" htmlFor="address" required error={errors.address} className="sm:col-span-2">
                  <input id="address" name="address" value={form.address} onChange={update} placeholder="Adresse complète" className="field-base" aria-invalid={Boolean(errors.address)} />
                </Field>
                <Field label="Photo (URL)" htmlFor="avatarUrl" hint="Facultatif : lien public vers une image." className="sm:col-span-2">
                  <input id="avatarUrl" name="avatarUrl" type="url" value={form.avatarUrl} onChange={update} placeholder="https://exemple.fr/photo.jpg" className="field-base" />
                </Field>
              </div>
            </section>

            <section>
              <p className="section-kicker">Scolarité</p>
              <h3 className="mt-1 text-[17px] font-semibold leading-tight text-ink">Parcours scolaire</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Numéro étudiant" htmlFor="studentId">
                  <input id="studentId" value={form.studentId} readOnly className="field-base bg-surface-2 text-muted" />
                </Field>
                <Field label="Filière" htmlFor="field" required error={errors.field}>
                  <select id="field" name="field" value={form.field} onChange={update} className="field-base" aria-invalid={Boolean(errors.field)}>
                    {FIELDS.map((field) => <option key={field}>{field}</option>)}
                  </select>
                </Field>
                <Field label="Classe" htmlFor="className" required error={errors.className}>
                  <select id="className" name="className" value={form.className} onChange={update} className="field-base" aria-invalid={Boolean(errors.className)}>
                    {CLASSES.map((className) => <option key={className}>{className}</option>)}
                  </select>
                </Field>
                <Field label="Date d'inscription" htmlFor="enrollmentDate" required error={errors.enrollmentDate}>
                  <input id="enrollmentDate" name="enrollmentDate" type="date" value={form.enrollmentDate} onChange={update} className="field-base" aria-invalid={Boolean(errors.enrollmentDate)} />
                </Field>
                <Field label="Statut" htmlFor="status" required error={errors.status} className="sm:col-span-2">
                  <select id="status" name="status" value={form.status} onChange={update} className="field-base" aria-invalid={Boolean(errors.status)}>
                    {STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </Field>
              </div>
            </section>
          </div>

          <div className="flex flex-wrap justify-end gap-2 px-5 pb-5 pt-2 sm:px-6">
            <Button to="/students" variant="secondary">Annuler</Button>
            <Button type="submit" variant="primary" loading={saving}>
              {existing ? "Enregistrer les modifications" : "Ajouter l'étudiant"}
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <section className="surface overflow-hidden">
            <header className="px-5 pb-2 pt-4">
              <p className="section-kicker">Aperçu</p>
              <h2 className="mt-1 text-[17px] font-semibold leading-tight text-ink">Aperçu en direct</h2>
            </header>
            <div className="px-5 py-5">
              <p className="text-[16px] font-semibold text-ink">{fullName(form) || "Nouvel étudiant"}</p>
              <p className="mt-1 truncate text-[13px] text-muted">{form.email || "email@exemple.fr"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={form.status} />
                <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-muted">{form.field}</span>
                <span className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-muted">{form.className}</span>
              </div>
              <p className="mt-5 text-[13px] text-muted">{form.studentId}</p>
            </div>
          </section>
          <section className="surface p-5">
            <p className="section-kicker">Bon à savoir</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-muted">
              <li>L'aperçu se met à jour pendant la saisie.</li>
              <li>Le numéro étudiant est généré automatiquement.</li>
              <li>Les modifications sont enregistrées dans ce navigateur.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
