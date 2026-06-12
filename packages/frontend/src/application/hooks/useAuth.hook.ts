import { useState, useCallback } from "react";
import { authApi } from "../../infrastructure/api";
import type { AuthUser, LoginRequest, RegisterRequest } from "../../core/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    return axiosErr.response?.data?.error ?? "An error occurred";
  }
  return "An error occurred";
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  }));

  const register = useCallback(async (data: RegisterRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.register(data);
      localStorage.setItem("token", res.token);
      setState({ user: res.user, token: res.token, loading: false, error: null });
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.login(data);
      localStorage.setItem("token", res.token);
      setState({ user: res.user, token: res.token, loading: false, error: null });
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, loading: false, error: null });
  }, []);

  return {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.token,
    register,
    login,
    logout,
  };
}
