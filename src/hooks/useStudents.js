import { useContext } from "react";
import { StudentsContext } from "../context/StudentsContext";

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) throw new Error("useStudents doit être utilisé dans StudentsProvider");
  return context;
}
