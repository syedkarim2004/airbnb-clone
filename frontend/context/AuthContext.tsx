"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, SEEDED_USERS } from "@/types/auth";

interface AuthContextType {
  currentUser: User;
  switchUser: (user: User) => void;
  switchUserById: (userId: number) => void;
  isHost: boolean;
  isGuest: boolean;
  allUsers: User[];
  isLoaded: boolean;
}

const STORAGE_KEY = "airbnb_mock_user_id";
const DEFAULT_USER = SEEDED_USERS[0]; // Carol Davis (guest, id: 3)

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const parsedId = parseInt(savedId, 10);
        const match = SEEDED_USERS.find((u) => u.id === parsedId);
        if (match) {
          setCurrentUser(match);
        }
      }
    } catch {
      // Ignore localStorage read errors in SSR/sandboxed environments
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const switchUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, user.id.toString());
    } catch {
      // Ignore write errors
    }
  };

  const switchUserById = (userId: number) => {
    const match = SEEDED_USERS.find((u) => u.id === userId);
    if (match) {
      switchUser(match);
    }
  };

  const isHost = currentUser.role === "host" || currentUser.role === "both";
  const isGuest = currentUser.role === "guest" || currentUser.role === "both";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        switchUserById,
        isHost,
        isGuest,
        allUsers: SEEDED_USERS,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
