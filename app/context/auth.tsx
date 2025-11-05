"use client";

import { apiGet } from "@/utils/fetch";
import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  is_admin?: boolean | null;
} | null;

type AuthState = {
  user: SessionUser;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({ user: null, loading: true, refresh: async () => {} });

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const j = await apiGet<{ user: SessionUser }>("/auth/me");
      setUser(j?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh: load }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
