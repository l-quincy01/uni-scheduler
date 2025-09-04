import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string } | null;

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

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // TODO: call your backend; set token, etc.
    const fakeUser = { id: "u1", email };
    localStorage.setItem("auth_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const signOut = async () => {
    localStorage.removeItem("auth_user");
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
