"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { setToken } from "@/services/api";
import type { LoginData, RegisterData } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(data: LoginData, redirectTo = "/select-account") {
    setError("");
    setLoading(true);
    try {
      const response = await authService.login(data);
      setToken(response.accessToken);

      // decide o destino pelo papel do usuário
      const destination =
        response.user.role === "ADMIN" ? "/select-account" : "/swipe";

      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function register(data: RegisterData, redirectTo = "/login") {
    setError("");
    setLoading(true);
    try {
      await authService.register(data);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return { login, register, loading, error, setError };
}