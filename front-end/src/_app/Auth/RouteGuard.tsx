import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // add skeleton
  if (loading) return null;
  if (!user)
    return <Navigate to="/signin" replace state={{ from: location }} />;

  return <Outlet />;
}

export function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
