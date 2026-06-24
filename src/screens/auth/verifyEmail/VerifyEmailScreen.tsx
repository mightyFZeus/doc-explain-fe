"use client";

import { FormEvent, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useVerifyEmailMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { AuthFooterLink } from "../components/AuthFooterLink";
import { AuthFormShell } from "../components/AuthFormShell";

export function VerifyEmailScreen() {
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await verifyEmail({ email, token }).unwrap();
      setMessage("Email verified.");
    } catch (verificationError) {
      setError(
        getApiErrorMessage(
          verificationError,
          "Email verification is not available yet.",
        ),
      );
    }
  };

  return (
    <AuthFormShell
      footer={
        <AuthFooterLink
          href={ROUTES.login}
          label="Login"
          prompt="Verification complete?"
        />
      }
      subtitle="Confirm the email address attached to your workspace."
      title="Verify email"
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
        <Input
          label="Verification code"
          onChange={(event) => setToken(event.target.value)}
          placeholder="Enter code"
          required
          value={token}
        />
        {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <Button
          className="w-full"
          icon={<BadgeCheck className="h-4 w-4" />}
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          Verify email
        </Button>
      </form>
    </AuthFormShell>
  );
}
