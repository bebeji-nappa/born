"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, type User } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiClient.getCurrentUser();
      console.log("Auth check response:", response);
      setUser(response?.user || null);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

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

  console.log("useAuth user:", user);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refetch: checkAuth,
  };
}
