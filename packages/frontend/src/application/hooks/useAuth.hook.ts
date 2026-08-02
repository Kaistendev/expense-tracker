import { useState, useCallback } from "react";
import { authApi } from "../../infrastructure/api";
import { getErrorMessage } from "./getErrorMessage";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../../core/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => ({
    user: readStoredUser(),
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
  }));

  const register = useCallback(async (data: RegisterRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.register(data);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
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
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setState({ user: res.user, token: res.token, loading: false, error: null });
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.updateProfile(data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setState((s) => ({ ...s, user: res.user, loading: false, error: null }));
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authApi.changePassword(data);
      setState((s) => ({ ...s, loading: false, error: null }));
      return res;
    } catch (err) {
      const error = getErrorMessage(err);
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
    updateProfile,
    changePassword,
    logout,
  };
}