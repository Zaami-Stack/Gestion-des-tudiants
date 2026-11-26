import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateRegistration } from "../utils/validate";

const initial = { name: "", email: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [failure, setFailure] = useState("");

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFailure("");
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateRegistration(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const session = await register(form);
      notify(`Compte créé pour ${session.name}.`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFailure(error.message);
    }
  }

  return (
    <div>
      <p className="section-kicker">Création de compte</p>
      <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">Rejoindre EduFlow.</h2>
      <p className="mt-2 text-[14px] leading-6 text-muted">Créez un accès local pour découvrir l'espace de gestion.</p>

      {failure && (
        <div role="alert" className="mt-6 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {failure}
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <Field label="Nom complet" htmlFor="register-name" required error={errors.name}>
          <input
            id="register-name"
            name="name"
            value={form.name}
            onChange={update}
            placeholder="Camille Bernard"
            autoComplete="name"
            className="field-base"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Adresse email" htmlFor="register-email" required error={errors.email}>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="vous@etablissement.fr"
            autoComplete="email"
            className="field-base"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Mot de passe" htmlFor="register-password" required error={errors.password} hint="Au moins 6 caractères.">
          <div className="relative">
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update}
              placeholder="Votre mot de passe"
              autoComplete="new-password"
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

        <Field label="Confirmer le mot de passe" htmlFor="register-confirm" required error={errors.confirmPassword}>
          <input
            id="register-confirm"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={update}
            placeholder="Répétez le mot de passe"
            autoComplete="new-password"
            className="field-base"
            aria-invalid={Boolean(errors.confirmPassword)}
          />
        </Field>

        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="mt-7 text-center text-[13px] text-muted">
        Vous avez déjà un accès ?{" "}
        <Button to="/login" variant="ghost" size="sm">
          Se connecter
        </Button>
      </p>
    </div>
  );
}
