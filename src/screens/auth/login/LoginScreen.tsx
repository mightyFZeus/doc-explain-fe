"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useLoginUserMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";
import { AuthFooterLink } from "../components/AuthFooterLink";
import { AuthFormShell } from "../components/AuthFormShell";

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await loginUser({ email, password }).unwrap();
      dispatch(
        setSession({
          user: response.user ?? null,
          token: response.accessToken ?? response.token ?? null,
        }),
      );
      router.push(ROUTES.dashboard);
    } catch (loginError) {
      setError(
        getApiErrorMessage(
          loginError,
          "Login is not available yet.",
        ),
      );
    }
  };

  return (
    <AuthFormShell
      footer={
        <AuthFooterLink
          href={ROUTES.signup}
          label="Create an account"
          prompt="New to Doc Explain?"
        />
      }
      subtitle="Enter your workspace details to continue."
      title="Welcome back"
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
          autoComplete="current-password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
          type="password"
          value={password}
        />
        <div className="flex justify-end">
          <Link
            className="focus-ring rounded-md text-sm font-medium text-muted transition-colors hover:text-ink"
            href={ROUTES.forgetPassword}
          >
            Forgot password?
          </Link>
        </div>
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <Button
          className="w-full"
          icon={<LogIn className="h-4 w-4" />}
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          Login
        </Button>
      </form>
    </AuthFormShell>
  );
}
