import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ActionMenu from "../components/ui/ActionMenu";
import Button from "../components/ui/Button";
import { buttonClass } from "../components/ui/buttonStyles";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import SearchInput from "../components/ui/SearchInput";
import StatusBadge from "../components/ui/StatusBadge";
import { TableSkeleton } from "../components/ui/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";
import { CLASSES, FIELDS, PAGE_SIZE, STATUSES } from "../utils/constants";
import { formatDate, fullName, normalize } from "../utils/format";

const emptyFilters = { status: "Tous", field: "Toutes", className: "Toutes" };

function SortHeader({ label, sortKey, current, direction, onSort }) {
  const active = current === sortKey;
  const indicator = active ? (direction === "asc" ? "↑" : "↓") : "";
  return (
    <th
      scope="col"
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
      className="whitespace-nowrap px-4 py-2.5"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={buttonClass(
          "ghost",
          "sm",
          active ? "!px-1 font-semibold" : "!px-1 font-medium !text-muted"
        )}
      >
        {label}
        {indicator ? <span aria-hidden="true" className="text-[12px]">{indicator}</span> : null}
      </button>
    </th>
  );
}

export default function StudentsPage() {
  const { students, loading, deleteStudent } = useStudents();
  const notify = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState({ key: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = normalize(debouncedSearch.trim());
    const result = students.filter((student) => {
      const matchesTerm =
        !term ||
        normalize(`${fullName(student)} ${student.email} ${student.studentId} ${student.field} ${student.className}`).includes(term);
      const matchesStatus = filters.status === "Tous" || student.status === filters.status;
      const matchesField = filters.field === "Toutes" || student.field === filters.field;
      const matchesClass = filters.className === "Toutes" || student.className === filters.className;
      return matchesTerm && matchesStatus && matchesField && matchesClass;
    });

    const factor = sort.direction === "asc" ? 1 : -1;
    return result.sort((a, b) => {
      switch (sort.key) {
        case "name":
          return fullName(a).localeCompare(fullName(b), "fr") * factor;
        case "studentId":
          return a.studentId.localeCompare(b.studentId, "fr") * factor;
        case "field":
          return a.field.localeCompare(b.field, "fr") * factor;
        case "className":
          return a.className.localeCompare(b.className, "fr") * factor;
        case "status":
          return a.status.localeCompare(b.status, "fr") * factor;
        default:
          return a.createdAt.localeCompare(b.createdAt) * factor;
      }
    });
  }, [students, debouncedSearch, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateSearch(value) {
    setPage(1);
    setSearchParams(value ? { q: value } : {}, { replace: true });
  }

  function changeFilter(key, value) {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleSort(key) {
    setPage(1);
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  function resetFilters() {
    setPage(1);
    setFilters(emptyFilters);
    updateSearch("");
    setSort({ key: "createdAt", direction: "desc" });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteStudent(pendingDelete.id);
      notify(`${fullName(pendingDelete)} a été supprimé.`, "info");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters = Boolean(search) || Object.values(filters).some((value) => value !== "Toutes" && value !== "Tous");
  const actionsFor = (student) => [
    { label: "Voir le dossier", onClick: () => navigate(`/students/${student.id}`) },
    { label: "Modifier", onClick: () => navigate(`/students/edit/${student.id}`) },
    { label: "Supprimer", tone: "danger", onClick: () => setPendingDelete(student) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Annuaire"
        title="Étudiants"
        description={`${students.length} dossier${students.length > 1 ? "s" : ""} enregistré${students.length > 1 ? "s" : ""}. Recherchez, filtrez et gérez les dossiers.`}
        actions={<Button to="/students/add" variant="primary">Ajouter un étudiant</Button>}
      />

      <section className="surface overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <p className="section-kicker">Recherche et filtres</p>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
            <SearchInput value={search} onChange={updateSearch} placeholder="Nom, email ou numéro étudiant…" />
            <select
              value={filters.status}
              onChange={(event) => changeFilter("status", event.target.value)}
              className="field-base lg:w-36"
              aria-label="Filtrer par statut"
            >
              <option value="Tous">Tous les statuts</option>
              {STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select
              value={filters.field}
              onChange={(event) => changeFilter("field", event.target.value)}
              className="field-base lg:w-40"
              aria-label="Filtrer par filière"
            >
              <option value="Toutes">Toutes les filières</option>
              {FIELDS.map((field) => <option key={field}>{field}</option>)}
            </select>
            <select
              value={filters.className}
              onChange={(event) => changeFilter("className", event.target.value)}
              className="field-base lg:w-36"
              aria-label="Filtrer par classe"
            >
              <option value="Toutes">Toutes les classes</option>
              {CLASSES.map((className) => <option key={className}>{className}</option>)}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] text-muted">
              <span className="font-semibold text-ink">{filtered.length}</span> résultat{filtered.length > 1 ? "s" : ""} sur {students.length}
            </p>
            {hasFilters && (
              <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="surface overflow-hidden">
          <TableSkeleton rows={7} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <p className="section-kicker">Résultats</p>
          </div>
          <EmptyState
            title="Aucun dossier trouvé"
            description="Modifiez la recherche ou les filtres, ou créez un nouveau dossier étudiant."
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={resetFilters}>Réinitialiser les filtres</Button>
              ) : (
                <Button to="/students/add" variant="primary">Ajouter un étudiant</Button>
              )
            }
          />
        </div>
      ) : (
        <>
          <div className="surface hidden overflow-hidden lg:block">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="section-kicker">Annuaire</p>
                <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Étudiants</h2>
              </div>
              <p className="text-[13px] text-muted">{filtered.length} dossier{filtered.length > 1 ? "s" : ""}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-line bg-surface-2/30 text-muted">
                  <tr>
                    <SortHeader label="Étudiant" sortKey="name" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <SortHeader label="Numéro" sortKey="studentId" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <SortHeader label="Filière" sortKey="field" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <SortHeader label="Classe" sortKey="className" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <SortHeader label="Statut" sortKey="status" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <SortHeader label="Inscrit le" sortKey="createdAt" current={sort.key} direction={sort.direction} onSort={toggleSort} />
                    <th scope="col" className="px-4 py-3 text-right text-[13px] font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((student) => (
                    <tr key={student.id} className="ios-row transition">
                      <td className="px-4 py-3.5">
                        <div className="min-w-0">
                          <Link to={`/students/${student.id}`} className="-mx-2 flex min-h-9 items-center rounded-xl px-2 text-[12px] font-medium text-ink">
                            <span className="truncate">{fullName(student)}</span>
                          </Link>
                          <p className="mt-0.5 truncate text-[12px] text-muted">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-muted">{student.studentId}</td>
                      <td className="px-4 py-3.5 text-[13px] text-ink">{student.field}</td>
                      <td className="px-4 py-3.5 text-[13px] text-muted">{student.className}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={student.status} /></td>
                      <td className="px-4 py-3.5 text-[13px] text-muted">{formatDate(student.enrollmentDate)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex min-h-9 items-center justify-end">
                          <ActionMenu items={actionsFor(student)} label={`Actions pour ${fullName(student)}`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>

          <div className="lg:hidden">
            <div className="surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <p className="section-kicker">Dossiers</p>
                  <h2 className="mt-1 text-[18px] font-semibold leading-tight text-ink">Étudiants</h2>
                </div>
                <p className="text-[13px] text-muted">{filtered.length} dossier{filtered.length > 1 ? "s" : ""}</p>
              </div>
              <div className="divide-y divide-line">
                {visible.map((student) => (
                  <div key={student.id} className="ios-row flex items-start gap-3 px-4 py-4">
                    <div className="min-w-0 flex-1">
                      <Link to={`/students/${student.id}`} className="-ml-2 inline-flex min-h-9 max-w-full items-center rounded-xl px-2 text-[12px] font-medium text-ink">
                        <span className="truncate">{fullName(student)}</span>
                      </Link>
                      <p className="mt-0.5 truncate text-[13px] text-muted">{student.studentId} · {student.email}</p>
                      <p className="mt-1 text-[13px] text-muted">{student.field} · {student.className}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={student.status} />
                        <span className="text-[12px] text-muted">{formatDate(student.enrollmentDate)}</span>
                      </div>
                    </div>
                    <div className="flex min-h-9 items-center justify-end">
                      <ActionMenu items={actionsFor(student)} label={`Actions pour ${fullName(student)}`} />
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Supprimer ce dossier ?"
        description={`Le dossier de ${fullName(pendingDelete || {})} sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
