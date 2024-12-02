// AuthContext.tsx
"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  companyName: string | null;
  setCompanyName: (name: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyName, setCompanyName] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ companyName, setCompanyName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
