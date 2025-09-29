"use client";

import { useState, useEffect } from "react";
import { apiClient, type User } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      setUser(response?.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiClient.signOut();
      setUser(null);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const signIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/auth/signin/github`;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refetch: checkAuth,
  };
}
