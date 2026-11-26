import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="surface mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
      <p className="section-kicker">404</p>
      <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">Cette page n'existe pas</h1>
      <p className="mt-2 max-w-sm text-[14px] leading-6 text-muted">
        Le lien est peut-être obsolète. Revenez à l'accueil ou ouvrez votre espace de gestion.
      </p>
      <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
        <Button to="/" variant="secondary">Retour à l'accueil</Button>
        <Button to="/dashboard" variant="primary">Tableau de bord</Button>
      </div>
    </div>
  );
}
