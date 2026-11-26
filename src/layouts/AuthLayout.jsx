import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas pt-[env(safe-area-inset-top)]">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
          <p className="brand-mark text-[18px] text-ink">EduFlow</p>
          <p className="section-kicker ml-auto">Accès sécurisé</p>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-5 text-center text-[13px] text-muted sm:px-8">
          © 2026 EduFlow · Environnement de démonstration
        </div>
      </footer>
    </div>
  );
}
