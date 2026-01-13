// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authSession } from "../utils/authSession";

export default function RequireAuth({ allowRoles = ["user", "admin"] }) {
  const token = authSession.getToken();
  const role = authSession.getRole();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowRoles && role && !allowRoles.includes(role)) {
    authSession.logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
