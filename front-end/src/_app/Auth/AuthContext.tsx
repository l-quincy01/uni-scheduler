import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, refreshAccessToken } from "@/lib/auth";

type User = { id: number; email: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Boot: load from storage, optionally refresh access
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    async function init() {
      if (accessToken) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_AUTH_API_BASE}/auth/me`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
          } else if (refreshToken) {
            const { accessToken: newAT } = await refreshAccessToken(
              refreshToken
            );
            localStorage.setItem("accessToken", newAT);
          }
        } catch {
          // fallback to no user
        }
      } else if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }

    init();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("auth_user", JSON.stringify(res.user));
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    setUser(res.user);
  };

  const signOut = async () => {
    const rt = localStorage.getItem("refreshToken") || "";
    await logoutUser(rt, true); // revoke all refresh tokens (logout everywhere)
    localStorage.removeItem("auth_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
