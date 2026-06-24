export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgetPassword: "/forget-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  document: (documentId: string) => `/dashboard/documents/${documentId}`,
} as const;
