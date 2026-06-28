type ErrorWithData = {
  data?: unknown;
  error?: unknown;
  status?: number | string;
};

export const TRIAL_LIMIT_MESSAGE =
  "Guest trial limit reached. Sign up or log in to continue.";

export function isForbiddenApiError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: unknown }).status === 403,
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as ErrorWithData;
    const data = value.data;

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      const record = data as Record<string, unknown>;
      if (typeof record.error === "string") {
        return record.error;
      }
      if (typeof record.message === "string") {
        return record.message;
      }
    }

    if (typeof value.error === "string") {
      return value.error;
    }
  }

  return fallback;
}
