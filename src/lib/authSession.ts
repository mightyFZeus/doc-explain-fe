import type { TrialLimits, TrialUsage, User } from "@/types/apiTypes";

export const AUTH_SESSION_STORAGE_KEY = "doc-explain:auth-session";

export interface AuthSession {
  expiresAt?: string | null;
  limits?: TrialLimits | null;
  token: string | null;
  trialUsage?: TrialUsage | null;
  user: User | null;
}

const isUser = (value: unknown): value is User =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { id?: unknown }).id === "string" &&
      typeof (value as { email?: unknown }).email === "string" &&
      typeof (value as { fullName?: unknown }).fullName === "string",
  );

const normalizeSession = (value: unknown): AuthSession | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const session = value as Partial<AuthSession>;
  const expiresAt =
    typeof session.expiresAt === "string" ? session.expiresAt : null;
  const limits =
    session.limits &&
    typeof session.limits === "object" &&
    typeof session.limits.documents === "number" &&
    typeof session.limits.questions === "number"
      ? session.limits
      : null;
  const trialUsage =
    session.trialUsage &&
    typeof session.trialUsage === "object" &&
    typeof session.trialUsage.documents === "number" &&
    typeof session.trialUsage.questions === "number"
      ? session.trialUsage
      : null;
  const user = isUser(session.user) ? session.user : null;
  const token = typeof session.token === "string" ? session.token : null;

  if (!user && !token) {
    return null;
  }

  return { expiresAt, limits, token, trialUsage, user };
};

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return storedSession ? normalizeSession(JSON.parse(storedSession)) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
