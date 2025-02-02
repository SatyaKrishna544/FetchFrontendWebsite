import React, { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure AsyncStorage is imported

interface AuthContextType {
  token: string | null;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = async (name: string, email: string): Promise<boolean> => {
    try {
      const response = await loginUser(name, email);
      if (response && response.success) {
        setToken("authenticated"); // Replace with actual token if returned
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
      setToken(null); // Clear the authentication state

      // Clear stored favorites or any other data from AsyncStorage
      await AsyncStorage.removeItem("favorites"); // Clear favorites data on logout
      await AsyncStorage.removeItem("userData"); // Optionally clear user data (if any)

      // Optional: If you want to clear all AsyncStorage data, you can do:
      // await AsyncStorage.clear();

    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
