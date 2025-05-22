import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const AuththenRoute = ({ children }: Props) => {
  const role = isAuthenticated();

  if (!role) {
    // Nếu không đăng nhập => chuyển tới trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập thì redirect theo role
  // if (role === "admin") {
  //   return <Navigate to="/admin" replace />;
  // } else if (role === "user") {
  //   return <Navigate to="/user" replace />;
  // }
  if (role === "user") {
    return <Navigate to="/user" replace />;
  }

  // Nếu role không hợp lệ thì chuyển về login
  return children;
};

export default AuththenRoute;
