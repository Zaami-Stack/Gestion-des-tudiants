import { CLASSES, FIELDS, GENDERS, STATUSES } from "./constants";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStudent(values = {}) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = "Le prénom est obligatoire.";
  if (!values.lastName?.trim()) errors.lastName = "Le nom est obligatoire.";
  if (!emailPattern.test(values.email?.trim() || "")) errors.email = "Saisissez une adresse email valide.";
  if (!values.phone?.trim()) errors.phone = "Le téléphone est obligatoire.";
  else if (values.phone.replace(/[^\d]/g, "").length < 9) errors.phone = "Numéro de téléphone invalide.";
  if (!values.dateOfBirth) errors.dateOfBirth = "La date de naissance est obligatoire.";
  else if (new Date(values.dateOfBirth) >= new Date()) errors.dateOfBirth = "La date doit être dans le passé.";
  if (!values.address?.trim()) errors.address = "L'adresse est obligatoire.";
  if (!FIELDS.includes(values.field)) errors.field = "Choisissez une filière.";
  if (!CLASSES.includes(values.className)) errors.className = "Choisissez une classe.";
  if (!STATUSES.includes(values.status)) errors.status = "Choisissez un statut.";
  if (values.gender && !GENDERS.includes(values.gender)) errors.gender = "Genre invalide.";
  if (!values.enrollmentDate) errors.enrollmentDate = "La date d'inscription est obligatoire.";
  return errors;
}

export function validateLogin(values = {}) {
  const errors = {};
  if (!emailPattern.test(values.email?.trim() || "")) errors.email = "Adresse email invalide.";
  if (!values.password) errors.password = "Le mot de passe est obligatoire.";
  else if (values.password.length < 6) errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
  return errors;
}

export function validateRegistration(values = {}) {
  const errors = validateLogin(values);
  if (!values.name?.trim()) errors.name = "Votre nom est obligatoire.";
  if (values.password && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }
  return errors;
}
