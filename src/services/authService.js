import { DEMO_ACCOUNT } from "../utils/constants";

const USERS_KEY = "eduflow.users.v1";
const SESSION_KEY = "eduflow.session.v1";

const demoUsers = [
  {
    id: "user-demo",
    name: DEMO_ACCOUNT.name,
    role: DEMO_ACCOUNT.role,
    email: DEMO_ACCOUNT.email,
    password: DEMO_ACCOUNT.password,
  },
];

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : demoUsers;
  } catch {
    return demoUsers;
  }
}

function persistSession(user, remember) {
  const session = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  const target = remember ? localStorage : sessionStorage;
  target.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function delay(value, ms = 520) {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export function getSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export async function login(email, password, remember = true) {
  const user = readUsers().find(
    (entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password
  );
  if (!user) throw new Error("Email ou mot de passe incorrect.");
  return delay(persistSession(user, remember));
}

export async function register({ name, email, password }) {
  const users = readUsers();
  if (users.some((entry) => entry.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error("Un compte existe déjà avec cette adresse email.");
  }
  const user = {
    id: globalThis.crypto?.randomUUID?.() || `user-${Date.now()}`,
    name: name.trim(),
    role: "Utilisateur",
    email: email.trim().toLowerCase(),
    password,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return delay(persistSession(user, true));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function isDemoAccount(email = "") {
  return email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase();
}
