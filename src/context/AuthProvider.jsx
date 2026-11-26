import { useCallback, useState } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getSession);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password, remember) => {
    setLoading(true);
    try {
      const session = await authService.login(email, password, remember);
      setUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (values) => {
    setLoading(true);
    try {
      const session = await authService.register(values);
      setUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
