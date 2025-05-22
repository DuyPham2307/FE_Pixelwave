import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const role = isAuthenticated();

  if (role) {
    // Nếu đã đăng nhập thì redirect về trang role tương ứng
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "user") {
      return <Navigate to="/user" replace />;
    }
  }

  // Nếu chưa đăng nhập thì cho hiển thị trang public (login,...)
  return children;
};

export default PublicRoute;
