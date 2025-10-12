import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user)
    return <Navigate to="/welcome" replace state={{ from: location }} />;

  return <Outlet />;
}

export function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
