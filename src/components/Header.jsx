import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronRight, FiGrid, FiLogOut, FiMenu, FiSearch, FiSettings, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { fullName, initials, searchStudents } from "../utils/format";

const titles = {
  "/dashboard": "Tableau de bord",
  "/students": "Étudiants",
  "/students/add": "Nouvel étudiant",
  "/settings": "Paramètres",
};

function titleFor(pathname) {
  if (pathname.startsWith("/students/edit/")) return "Modifier un étudiant";
  if (pathname.startsWith("/students/")) return "Fiche étudiant";
  return titles[pathname] || "EduFlow";
}

export default function Header({ onMenuClick, onOpenPalette }) {
  const { user, logout } = useAuth();
  const { students } = useStudents();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountIndex, setAccountIndex] = useState(0);
  const accountRef = useRef(null);
  const accountMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchBoxRef = useRef(null);
  const displayName = user?.name || "Utilisateur";

  const suggestions = useMemo(() => searchStudents(students, query).slice(0, 5), [students, query]);

  function submitSearch(value = query) {
    const term = value.trim();
    if (!term) return;
    navigate(`/students?q=${encodeURIComponent(term)}`);
    setQuery("");
    setSearchOpen(false);
    searchRef.current?.blur();
  }

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onPointerDown = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        return;
      }
      const items = accountMenuRef.current?.querySelectorAll('[role="menuitem"]') ?? [];
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (items.length === 0) return;
        const step = event.key === "ArrowDown" ? 1 : -1;
        setAccountIndex((current) => (current + step + items.length) % items.length);
        return;
      }
      if (event.key === "Enter" && items.length > 0) {
        event.preventDefault();
        items[accountIndex]?.click();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen, accountIndex]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const onPointerDown = (event) => {
      if (!searchBoxRef.current?.contains(event.target)) setSearchOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        searchRef.current?.blur();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      if (searchRef.current?.offsetParent === null) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-30 h-20 border-b border-line bg-surface-2">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="!px-2.5 lg:hidden"
        >
          <FiMenu size={19} aria-hidden="true" />
        </Button>

        <div className="min-w-0">
          <p className="section-kicker hidden sm:block">Espace de travail</p>
          <h1 className="truncate text-[15px] font-semibold leading-tight text-ink sm:text-[17px]">
            {titleFor(location.pathname)}
          </h1>
        </div>

        <form
          ref={searchBoxRef}
          className="relative ml-auto hidden w-full max-w-xs md:block"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <FiSearch size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Rechercher un étudiant…"
            aria-label="Rechercher un étudiant"
            className="field-base pl-9 pr-9"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted active:bg-surface-2"
            >
              <FiX size={14} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Ouvrir la recherche rapide"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted"
            >
              Ctrl K
            </button>
          )}
          <AnimatePresence>
            {searchOpen && query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="surface absolute left-0 right-0 top-[42px] z-50 overflow-hidden p-0 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)]"
              >
                <p className="section-kicker border-b border-line px-3 py-2">Résultats</p>
                {suggestions.length > 0 ? (
                  <>
                    <div className="py-1">
                      {suggestions.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => {
                            navigate(`/students/${student.id}`);
                            setQuery("");
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                            {initials(fullName(student))}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-medium text-ink">{fullName(student)}</span>
                            <span className="block truncate text-[10px] text-muted">{student.studentId} · {student.field}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => submitSearch()}
                      className="w-full border-t border-line px-3 py-2 text-[11px] font-semibold text-accent active:bg-surface-2"
                    >
                      Voir tous les résultats
                    </button>
                  </>
                ) : (
                  <p className="px-3 py-4 text-center text-[12px] text-muted">Aucun étudiant trouvé.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenPalette}
            aria-label="Ouvrir la recherche rapide"
            className="!px-2.5 md:hidden"
          >
            <FiSearch size={18} aria-hidden="true" />
          </Button>
          <ThemeToggle compact />
          <div ref={accountRef} className="relative">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setAccountIndex(0);
                setAccountOpen((current) => !current);
              }}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
              className="gap-2 !pl-1.5 !pr-2.5"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">
                {initials(displayName)}
              </span>
              <span className="hidden max-w-[130px] truncate sm:inline">{displayName}</span>
              <FiChevronDown size={14} aria-hidden="true" className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
            </Button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  ref={accountMenuRef}
                  id="account-menu"
                  role="menu"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="surface absolute right-0 top-[60px] z-50 w-64 overflow-hidden p-0 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative overflow-hidden border-b border-line bg-surface-2/60 px-4 py-3.5">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-xl" />
                    <div className="relative flex items-center gap-3">
                      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">
                        {initials(displayName)}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{displayName}</span>
                        <span className="block truncate text-[11px] text-muted">{user?.email || "admin@eduflow.fr"}</span>
                      </span>
                    </div>
                    <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {user?.role || "Démonstration"}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <p className="section-kicker px-2 py-1.5">Compte</p>
                    <Button
                      to="/dashboard"
                      variant="ghost"
                      size="sm"
                      role="menuitem"
                      className={`w-full !justify-start ${accountIndex === 0 ? "!bg-surface-2" : ""}`}
                      onClick={() => setAccountOpen(false)}
                    >
                      <FiGrid size={15} aria-hidden="true" />
                      <span className="flex-1 text-left">Tableau de bord</span>
                      <FiChevronRight size={13} aria-hidden="true" className="text-muted" />
                    </Button>
                    <Button
                      to="/settings"
                      variant="ghost"
                      size="sm"
                      role="menuitem"
                      className={`w-full !justify-start ${accountIndex === 1 ? "!bg-surface-2" : ""}`}
                      onClick={() => setAccountOpen(false)}
                    >
                      <FiSettings size={15} aria-hidden="true" />
                      <span className="flex-1 text-left">Paramètres</span>
                      <FiChevronRight size={13} aria-hidden="true" className="text-muted" />
                    </Button>
                    <div className="my-1 border-t border-line" />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      role="menuitem"
                      className={`w-full !justify-start ${accountIndex === 2 ? "!bg-danger/10" : ""}`}
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      <FiLogOut size={15} aria-hidden="true" />
                      <span className="flex-1 text-left">Se déconnecter</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
