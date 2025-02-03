import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, checkAuthStatus } from "./api"; // New function to check auth status
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    const verifyAuth = async () => {
      const loggedIn = await checkAuthStatus();
      setIsAuthenticated(loggedIn);
    };
    verifyAuth();
  }, []);

  const login = async (name: string, email: string): Promise<boolean> => {
    try {
      const response = await loginUser(name, email);
      if (response && response.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      setIsAuthenticated(false); // Update state
      await AsyncStorage.removeItem("favorites");
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
