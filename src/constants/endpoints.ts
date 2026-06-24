export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const HEALTH_ENDPOINT = "/health";

export const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  forgotPassword: "/auth/forgot-password",
  verifyEmail: "/auth/verify-email",
} as const;

export const DOCUMENT_ENDPOINTS = {
  list: "/documents",
  delete: "/document",
  conversations: "/document/conversations",
  upload: "/document/upload",
  search: "/document/search",
} as const;
