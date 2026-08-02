import { httpClient } from "../http-client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserProfileResponse,
} from "../../core/types";

export const authApi = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>("/auth/register", data).then((r) => r.data);
  },
  login(data: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>("/auth/login", data).then((r) => r.data);
  },
  updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    return httpClient.put<UserProfileResponse>("/auth/me", data).then((r) => r.data);
  },
  changePassword(data: ChangePasswordRequest): Promise<{ success: boolean }> {
    return httpClient.put<{ success: boolean }>("/auth/password", data).then((r) => r.data);
  },
};