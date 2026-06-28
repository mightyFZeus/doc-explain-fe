import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession } from "@/lib/authSession";
import type { TrialLimits, TrialUsage, User } from "@/types/apiTypes";

interface AuthState {
  expiresAt: string | null;
  isHydrated: boolean;
  limits: TrialLimits | null;
  trialUsage: TrialUsage | null;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  expiresAt: null,
  isHydrated: false,
  limits: null,
  trialUsage: null,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state, action: PayloadAction<AuthSession | null>) => {
      state.expiresAt = action.payload?.expiresAt ?? null;
      state.limits = action.payload?.limits ?? null;
      state.trialUsage = action.payload?.trialUsage ?? null;
      state.user = action.payload?.user ?? null;
      state.token = action.payload?.token ?? null;
      state.isHydrated = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isHydrated = true;
    },
    setSession: (
      state,
      action: PayloadAction<{
        expiresAt?: string | null;
        limits?: TrialLimits | null;
        trialUsage?: TrialUsage | null;
        user?: User | null;
        token?: string | null;
      }>,
    ) => {
      if (action.payload.expiresAt !== undefined) {
        state.expiresAt = action.payload.expiresAt;
      }
      if (action.payload.limits !== undefined) {
        state.limits = action.payload.limits;
      }
      if (action.payload.trialUsage !== undefined) {
        state.trialUsage = action.payload.trialUsage;
      }
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload.token !== undefined) {
        state.token = action.payload.token;
      }
      state.isHydrated = true;
    },
    recordGuestDocumentUpload: (state) => {
      if (state.user?.accountType !== "guest") {
        return;
      }

      state.trialUsage = {
        documents: (state.trialUsage?.documents ?? 0) + 1,
        questions: state.trialUsage?.questions ?? 0,
      };
    },
    recordGuestQuestion: (state) => {
      if (state.user?.accountType !== "guest") {
        return;
      }

      state.trialUsage = {
        documents: state.trialUsage?.documents ?? 0,
        questions: (state.trialUsage?.questions ?? 0) + 1,
      };
    },
    clearAuth: (state) => {
      state.expiresAt = null;
      state.limits = null;
      state.trialUsage = null;
      state.user = null;
      state.token = null;
      state.isHydrated = true;
    },
  },
});

export const {
  clearAuth,
  hydrateAuth,
  recordGuestDocumentUpload,
  recordGuestQuestion,
  setSession,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
