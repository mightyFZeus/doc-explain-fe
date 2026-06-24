"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { useRequestPasswordResetMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { AuthFooterLink } from "../components/AuthFooterLink";
import { AuthFormShell } from "../components/AuthFormShell";

export function ForgotPasswordScreen() {
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await requestPasswordReset({ email }).unwrap();
      setMessage("Password reset instructions have been sent.");
    } catch (resetError) {
      setError(
        getApiErrorMessage(
          resetError,
          "Password reset is not available yet.",
        ),
      );
    }
  };

  return (
    <AuthFormShell
      footer={
        <AuthFooterLink
          href={ROUTES.login}
          label="Back to login"
          prompt="Remembered your password?"
        />
      }
      subtitle="Use the email tied to your document workspace."
      title="Reset password"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <Button
          className="w-full"
          icon={<Mail className="h-4 w-4" />}
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          Send reset link
        </Button>
      </form>
    </AuthFormShell>
  );
}
