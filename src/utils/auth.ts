import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export const isAuthenticated = (): string => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : "";

  // Không có token thì không đăng nhập
  if (!accessToken || !refreshToken) {
    return "";
  }

  try {
    // Kiểm tra hạn của refreshToken
    const decoded: DecodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token hết hạn
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return "";
    }

    // Token còn hạn
    return role.toLowerCase() === "admin" ? "admin" : "user";

  } catch (error) {
    // Nếu decode lỗi => token không hợp lệ
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    console.log("Token không hợp lệ:", error);
    
    return "";
  }
};
