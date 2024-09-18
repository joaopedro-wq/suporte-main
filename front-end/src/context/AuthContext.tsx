/* // src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/usuarios/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        router.push("/"); 
      } else {
        throw new Error("Login falhou");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error; 
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
 */