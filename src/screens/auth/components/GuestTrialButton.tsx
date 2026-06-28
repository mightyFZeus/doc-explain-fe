"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useStartGuestTrialMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";

export function GuestTrialButton({
  className,
  label = "Try it out",
  onError,
  size = "md",
  variant = "secondary",
}: {
  className?: string;
  label?: string;
  onError?: (message: string) => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "inverse";
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [startGuestTrial, { isLoading }] = useStartGuestTrialMutation();
  const [localError, setLocalError] = useState("");

  const handleStartTrial = async () => {
    setLocalError("");
    onError?.("");

    try {
      const session = await startGuestTrial().unwrap();

      dispatch(
        setSession({
          expiresAt: session.expiresAt,
          limits: session.limits,
          token: session.token,
          trialUsage: {
            documents: 0,
            questions: 0,
          },
          user: session.user,
        }),
      );
      router.replace(ROUTES.dashboard);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to start a guest trial right now.",
      );
      setLocalError(message);
      onError?.(message);
    }
  };

  return (
    <div>
      <Button
        className={className}
        icon={<Sparkles className="h-4 w-4" />}
        isLoading={isLoading}
        onClick={handleStartTrial}
        size={size}
        type="button"
        variant={variant}
      >
        {label}
      </Button>
      {!onError && localError ? (
        <p className="mt-2 text-xs text-muted">{localError}</p>
      ) : null}
    </div>
  );
}
