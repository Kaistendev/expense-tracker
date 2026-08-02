interface ApiErrorPayload {
  error?: string | { message?: string };
}

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: ApiErrorPayload } };
    const data = axiosErr.response?.data?.error;
    if (typeof data === "string" && data) return data;
    if (data && typeof data === "object" && typeof data.message === "string") {
      return data.message;
    }
  }
  return "An error occurred";
}