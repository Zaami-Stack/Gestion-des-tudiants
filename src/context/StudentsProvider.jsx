import { useCallback, useEffect, useState } from "react";
import * as studentService from "../services/studentService";
import { StudentsContext } from "./StudentsContext";

export default function StudentsProvider({ children }) {
  const [students, setStudents] = useState(studentService.getAll);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 320);
    const unsubscribe = studentService.subscribe(() => setStudents(studentService.getAll()));
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const createStudent = useCallback(async (values) => {
    const created = await studentService.create(values);
    setStudents(studentService.getAll());
    return created;
  }, []);

  const updateStudent = useCallback(async (id, values) => {
    const updated = await studentService.update(id, values);
    setStudents(studentService.getAll());
    return updated;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    const removed = await studentService.remove(id);
    setStudents(studentService.getAll());
    return removed;
  }, []);

  const resetStudents = useCallback(() => {
    const initial = studentService.reset();
    setStudents(initial);
  }, []);

  return (
    <StudentsContext.Provider
      value={{ students, loading, createStudent, updateStudent, deleteStudent, resetStudents }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
