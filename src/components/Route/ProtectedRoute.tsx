// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles: string[]; // ["USER"] hoặc ["ADMIN"]
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userSave = localStorage.getItem('user');
  const role = userSave ? JSON.parse(userSave).role : "";
  if (!role) return <Navigate to="/login" replace />;
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />;


};

export default ProtectedRoute;
