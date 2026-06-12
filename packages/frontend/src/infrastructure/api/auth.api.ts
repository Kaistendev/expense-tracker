import { httpClient } from "../http-client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../../core/types";

export const authApi = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>("/auth/register", data).then((r) => r.data);
  },
  login(data: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>("/auth/login", data).then((r) => r.data);
  },
};
