import { nextStudentId } from "../utils/format";

const STORAGE_KEY = "eduflow.students.v1";
const LEGACY_KEY = "eduflow-students";
const CHANGE_EVENT = "eduflow:students-changed";

const seed = [
  ["Amina", "Benali", "amina.benali@eduflow.fr", "+213 555 010 101", "Informatique", "Licence 3", "Actif", "2003-04-12", "12 rue des Lilas, Alger", "Femme", "2025-09-08"],
  ["Youssef", "Hamdi", "youssef.hamdi@eduflow.fr", "+213 555 010 102", "Gestion", "Master 1", "Actif", "2002-11-03", "8 avenue de la République, Oran", "Homme", "2025-09-10"],
  ["Sara", "Khalil", "sara.khalil@eduflow.fr", "+213 555 010 103", "Droit", "Licence 2", "En attente", "2004-02-19", "27 boulevard Victor Hugo, Constantine", "Femme", "2026-01-15"],
  ["Nassim", "Aït Ali", "nassim.aitali@eduflow.fr", "+213 555 010 104", "Ingénierie", "Master 2", "Actif", "2001-07-25", "5 cité des Palmiers, Tlemcen", "Homme", "2025-09-12"],
  ["Lina", "Mansouri", "lina.mansouri@eduflow.fr", "+213 555 010 105", "Médecine", "Licence 1", "Actif", "2005-01-08", "14 rue Nationale, Annaba", "Femme", "2026-10-18"],
  ["Karim", "Boudiaf", "karim.boudiaf@eduflow.fr", "+213 555 010 106", "Commerce", "Licence 3", "Inactif", "2002-05-30", "33 avenue Farouk, Sétif", "Homme", "2025-10-02"],
  ["Inès", "Cherif", "ines.cherif@eduflow.fr", "+213 555 010 107", "Sciences", "Master 1", "Actif", "2003-09-14", "9 rue des Écoles, Blida", "Femme", "2026-11-04"],
  ["Omar", "Ben Salem", "omar.bensalem@eduflow.fr", "+213 555 010 108", "Informatique", "Licence 1", "En attente", "2005-03-22", "18 avenue de l'Indépendance, Béjaïa", "Homme", "2026-11-12"],
  ["Nadia", "Zerrouki", "nadia.zerrouki@eduflow.fr", "+213 555 010 109", "Gestion", "Licence 2", "Actif", "2004-06-11", "4 impasse des Roses, Chlef", "Femme", "2026-02-03"],
  ["Bilal", "Mehdi", "bilal.mehdi@eduflow.fr", "+213 555 010 110", "Ingénierie", "Licence 3", "Actif", "2003-12-01", "21 rue Khemisti, Biskra", "Homme", "2026-10-28"],
  ["Chaima", "Lahmar", "chaima.lahmar@eduflow.fr", "+213 555 010 111", "Droit", "Master 2", "Inactif", "2001-10-17", "7 boulevard de la Liberté, Djijel", "Femme", "2025-09-20"],
  ["Rachid", "Fellah", "rachid.fellah@eduflow.fr", "+213 555 010 112", "Médecine", "Licence 2", "Actif", "2004-08-05", "16 avenue Pasteur, Tizi Ouzou", "Homme", "2026-03-11"],
  ["Maya", "Bouzid", "maya.bouzid@eduflow.fr", "+213 555 010 113", "Commerce", "Master 2", "En attente", "2002-02-28", "2 rue des Cerisiers, Médéa", "Femme", "2026-11-20"],
  ["Tariq", "Nacer", "tariq.nacer@eduflow.fr", "+213 555 010 114", "Sciences", "Licence 1", "Actif", "2005-05-09", "41 avenue de la Paix, Laghouat", "Homme", "2026-09-15"],
];

function toStudent(row, index) {
  const [firstName, lastName, email, phone, field, className, status, dateOfBirth, address, gender, enrollmentDate] = row;
  return {
    id: `seed-${index + 1}`,
    studentId: `ETU-${enrollmentDate.slice(0, 4)}-${String(index + 1).padStart(4, "0")}`,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    address,
    gender,
    field,
    className,
    enrollmentDate,
    status,
    createdAt: `${enrollmentDate}T09:00:00.000Z`,
  };
}

function seedStudents() {
  return seed.map(toStudent);
}

function normalizeStudent(student = {}, index = 0) {
  const enrollmentDate = student.enrollmentDate || new Date().toISOString().slice(0, 10);
  return {
    id: student.id || `legacy-${index + 1}`,
    studentId: student.studentId || `ETU-${enrollmentDate.slice(0, 4)}-${String(index + 1).padStart(4, "0")}`,
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    email: student.email || "",
    phone: student.phone || "",
    dateOfBirth: student.dateOfBirth || "",
    address: student.address || "",
    gender: student.gender || "",
    field: student.field || "Informatique",
    className: student.className || student.level || "Licence 1",
    enrollmentDate,
    status: student.status || "Actif",
    createdAt: student.createdAt || `${enrollmentDate}T09:00:00.000Z`,
  };
}

function migrateLegacy(list = []) {
  const today = new Date().toISOString().slice(0, 10);
  return list.map((student, index) =>
    normalizeStudent({ ...student, enrollmentDate: today, className: student.level }, index)
  );
}

function read() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(normalizeStudent);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateLegacy(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    const initial = seedStudents();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return seedStudents();
  }
}

function write(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return students;
}

function withDelay(value, ms = 220) {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function getAll() {
  return read();
}

export function getById(id) {
  return read().find((student) => student.id === id) || null;
}

export async function create(values) {
  const students = read();
  const enrollmentDate = values.enrollmentDate || new Date().toISOString().slice(0, 10);
  const student = normalizeStudent(
    {
      ...values,
      id: globalThis.crypto?.randomUUID?.() || `student-${Date.now()}`,
      studentId: nextStudentId(students),
      enrollmentDate,
      createdAt: new Date().toISOString(),
    },
    students.length
  );
  write([student, ...students]);
  return withDelay(student);
}

export async function update(id, values) {
  const students = read();
  const next = students.map((student) =>
    student.id === id ? normalizeStudent({ ...student, ...values, id, studentId: student.studentId }, students.indexOf(student)) : student
  );
  write(next);
  return withDelay(next.find((student) => student.id === id));
}

export async function remove(id) {
  const students = read();
  const removed = students.find((student) => student.id === id);
  write(students.filter((student) => student.id !== id));
  return withDelay(removed);
}

export function reset() {
  return write(seedStudents());
}
