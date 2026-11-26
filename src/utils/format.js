export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function initials(...parts) {
  const words = parts.filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function fullName(student = {}) {
  return `${student.firstName || ""} ${student.lastName || ""}`.trim();
}

export function searchStudents(students = [], query = "") {
  const term = normalize(query.trim());
  if (!term) return [];
  return students.filter((student) =>
    normalize(`${fullName(student)} ${student.email} ${student.studentId} ${student.field} ${student.className}`).includes(term)
  );
}

export function formatDate(value, options = { day: "2-digit", month: "short", year: "numeric" }) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

export function formatLongDate(value) {
  return formatDate(value, { day: "numeric", month: "long", year: "numeric" });
}

export function recentMonthBuckets(count = 6) {
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { key, label: formatter.format(date), count: 0 };
  });
}

export function daysSince(value) {
  if (!value) return Infinity;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Infinity;
  return Math.floor((Date.now() - date.getTime()) / 86_400_000);
}

export function isRecent(value, days = 30) {
  const elapsed = daysSince(value);
  return elapsed >= 0 && elapsed <= days;
}

export function nextStudentId(students = []) {
  const year = new Date().getFullYear();
  const highest = students.reduce((max, student) => {
    const match = String(student.studentId || "").match(new RegExp(`^ETU-${year}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `ETU-${year}-${String(highest + 1).padStart(4, "0")}`;
}
