import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiGrid, FiSearch, FiSettings, FiUserPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../../hooks/useStudents";
import { fullName, initials, searchStudents } from "../../utils/format";

const actions = [
  { label: "Tableau de bord", hint: "Vue d'ensemble", to: "/dashboard", icon: FiGrid },
  { label: "Étudiants", hint: "Annuaire", to: "/students", icon: FiSearch },
  { label: "Nouvel étudiant", hint: "Créer un dossier", to: "/students/add", icon: FiUserPlus },
  { label: "Paramètres", hint: "Préférences", to: "/settings", icon: FiSettings },
];

export default function CommandPalette({ open, onClose }) {
  const { students } = useStudents();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const studentResults = useMemo(() => {
    if (!query.trim()) {
      return [...students].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
    }
    return searchStudents(students, query).slice(0, 6);
  }, [students, query]);

  const actionResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return actions;
    return actions.filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(term));
  }, [query]);

  const items = useMemo(
    () => [
      ...studentResults.map((student) => ({
        id: student.id,
        label: fullName(student),
        hint: `${student.studentId} · ${student.field}`,
        to: `/students/${student.id}`,
        initials: initials(fullName(student)),
      })),
      ...actionResults.map((action) => ({
        id: action.to,
        label: action.label,
        hint: action.hint,
        to: action.to,
        icon: action.icon,
      })),
    ],
    [studentResults, actionResults]
  );

  const close = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (items.length === 0) return;
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) => (current + step + items.length) % items.length);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) {
          navigate(item.to);
          close();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, items, activeIndex, navigate, close]);

  function renderItem(item, index) {
    const active = index === activeIndex;
    return (
      <button
        key={item.id}
        type="button"
        role="option"
        aria-selected={active}
        onClick={() => {
          navigate(item.to);
          close();
        }}
        className={`flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left ${active ? "bg-surface-2" : ""}`}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
          {item.icon ? <item.icon size={14} aria-hidden="true" /> : item.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-medium text-ink">{item.label}</span>
          <span className="block truncate text-[10px] text-muted">{item.hint}</span>
        </span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Recherche rapide"
            className="surface relative w-full max-w-xl overflow-hidden p-0 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="flex items-center gap-2 border-b border-line px-3">
              <FiSearch size={16} aria-hidden="true" className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Rechercher un étudiant ou une page…"
                aria-label="Rechercher un étudiant ou une page"
                className="h-12 w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
              />
              <button type="button" onClick={close} aria-label="Fermer la recherche" className="shrink-0 rounded p-1 text-muted active:bg-surface-2">
                <FiX size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="no-scrollbar max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label="Résultats">
              {studentResults.length > 0 && (
                <>
                  <p className="section-kicker px-2.5 py-1.5">{query.trim() ? "Étudiants" : "Récents"}</p>
                  {studentResults.map((student, index) => renderItem(items[index], index))}
                </>
              )}
              {actionResults.length > 0 && (
                <>
                  <p className="section-kicker px-2.5 pb-1.5 pt-3">Navigation</p>
                  {actionResults.map((action, index) => renderItem(items[studentResults.length + index], studentResults.length + index))}
                </>
              )}
              {items.length === 0 && <p className="px-3 py-8 text-center text-[12px] text-muted">Aucun résultat pour « {query.trim()} ».</p>}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-3 py-2 text-[10px] text-muted">
              <span>↑ ↓ naviguer</span>
              <span>↵ ouvrir</span>
              <span>esc fermer</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
