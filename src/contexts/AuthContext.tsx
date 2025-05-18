import { createContext, useEffect, useState } from "react";
import { loginGoogle, loginNormal, registerService } from "@/services/authService";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/models/AuthModel";

interface User {
  id: number;
  fullName: string;
  avatar?: string;
  role: "ADMIN" | "USER" | "GUEST";
};

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<LoginResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedUser && savedAccessToken && savedRefreshToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response: LoginResponse = await loginNormal(credentials);

      if (!response) {
        throw new Error("Login failed: No response received");
      }

      setUser(response.user);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response;
    } catch (err) {
      console.error("Login failed:", err);
      throw err; 
    }
  };

  const loginWithGoogle = async (code: string) => {
    try {
      const response: LoginResponse = await loginGoogle(code);
      if (!response) {
        throw new Error("Login failed: No response received");
      }
      setUser(response.user);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      await registerService(userData);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, loginWithGoogle, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};