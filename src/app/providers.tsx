"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from "@/lib/authSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/authSlice";
import { store } from "@/store/store";

function AuthSessionHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { expiresAt, isHydrated, limits, token, user } = useAppSelector(
    (state) => state.auth,
  );
  const trialUsage = useAppSelector((state) => state.auth.trialUsage);

  useEffect(() => {
    dispatch(hydrateAuth(loadAuthSession()));
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (user || token) {
      saveAuthSession({ expiresAt, limits, token, trialUsage, user });
      return;
    }

    clearAuthSession();
  }, [expiresAt, isHydrated, limits, token, trialUsage, user]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthSessionHydrator>{children}</AuthSessionHydrator>
    </Provider>
  );
}
