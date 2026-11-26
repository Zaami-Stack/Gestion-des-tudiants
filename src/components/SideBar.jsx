import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { buttonClass } from "./ui/buttonStyles";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { cn } from "../utils/format";

const navigation = [
  { to: "/dashboard", label: "Tableau de bord", shortLabel: "Accueil" },
  { to: "/students", label: "Étudiants", shortLabel: "Étudiants" },
  { to: "/settings", label: "Paramètres", shortLabel: "Réglages" },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const { students } = useStudents();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-line px-5">
        <Link
          to="/"
          className="flex h-10 items-center rounded-xl px-3 text-[17px] font-semibold tracking-[-0.01em] text-ink"
          aria-label="EduFlow, accueil"
        >
          EduFlow
        </Link>
      </div>

      <div className="px-3 pb-4 pt-5">
        <Button
          to="/students/add"
          onClick={onNavigate}
          className="w-full"
        >
          Nouvel étudiant
        </Button>
      </div>

      <nav className="flex-1 px-3 pt-1" aria-label="Navigation principale">
        <div className="flex flex-col gap-1 rounded-[16px] bg-surface p-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                buttonClass(
                  isActive ? "subtle" : "ghost",
                  "md",
                  cn("w-full !justify-start", !isActive && "!text-ink")
                )
              }
            >
              <span className="flex-1">{item.label}</span>
              {item.to === "/students" && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[12px] font-medium text-muted">
                  {students.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-3 pt-4">
        <div className="overflow-hidden rounded-[14px] bg-surface p-1">
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className={buttonClass("ghost", "md", "w-full !justify-start !text-ink")}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-ink">{user?.name || "Utilisateur"}</span>
              <span className="block truncate text-[12px] text-muted">{user?.role || "Démonstration"}</span>
            </span>
          </NavLink>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full !justify-start !text-danger"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-surface-2 lg:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[60] w-[280px] max-w-[85vw] bg-surface-2 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-3 top-4 z-10 !text-muted"
                aria-label="Fermer le menu"
              >
                Fermer
              </Button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-nav pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <div className="grid grid-cols-3 gap-1 px-2 pb-1.5 pt-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              buttonClass(
                isActive ? "subtle" : "ghost",
                "sm",
                cn("w-full", !isActive && "!text-muted")
              )
            }
          >
            {item.shortLabel}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
