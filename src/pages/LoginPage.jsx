import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { DEMO_ACCOUNT } from "../utils/constants";
import { validateLogin } from "../utils/validate";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [failure, setFailure] = useState("");

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFailure("");
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const session = await login(form.email, form.password, remember);
      notify(`Bienvenue ${session.name.split(" ")[0]}.`);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      setFailure(error.message);
    }
  }

  return (
    <div>
      <p className="section-kicker">Espace sécurisé</p>
      <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">Bon retour.</h2>
      <p className="mt-2 text-[14px] leading-6 text-muted">Connectez-vous pour accéder à votre espace de gestion.</p>

      {failure && (
        <div role="alert" className="mt-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {failure}
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <Field label="Adresse email" htmlFor="login-email" required error={errors.email}>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            placeholder={DEMO_ACCOUNT.email}
            className="field-base"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Mot de passe" htmlFor="login-password" required error={errors.password}>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={update}
              placeholder="Votre mot de passe"
              className="field-base pr-24"
              aria-invalid={Boolean(errors.password)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </Button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-[13px] font-medium text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Se souvenir de moi
          </label>
          <Button to="/register" variant="ghost" size="sm">
            Créer un compte
          </Button>
        </div>

        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-line bg-surface-2/50 p-5">
        <p className="section-kicker">Compte de démonstration</p>
        <p className="mt-3 text-[14px] font-medium text-ink">{DEMO_ACCOUNT.email}</p>
        <p className="mt-1 text-[13px] leading-6 text-muted">
          Authentification simulée côté client, structurée pour être remplacée par une API.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setForm({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password });
            setErrors({});
            setRemember(true);
          }}
          className="mt-4 w-full"
        >
          Remplir les identifiants
        </Button>
      </div>
    </div>
  );
}
