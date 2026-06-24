"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useRegisterUserMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { AuthFooterLink } from "../components/AuthFooterLink";
import { AuthFormShell } from "../components/AuthFormShell";

export function SignUpScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = await registerUser({
        confirmPassword,
        email,
        fullName,
        password,
        termsAccepted,
      }).unwrap();

      dispatch(setUser(user));
      router.push(ROUTES.dashboard);
    } catch (registrationError) {
      setError(getApiErrorMessage(registrationError));
    }
  };

  return (
    <AuthFormShell
      footer={
        <AuthFooterLink
          href={ROUTES.login}
          label="Login"
          prompt="Already have an account?"
        />
      }
      subtitle="Create a local account for document ownership and uploads."
      title="Create your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          label="Full name"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Ada Lovelace"
          required
          value={fullName}
        />
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
          autoComplete="new-password"
          label="Password"
          maxLength={72}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          required
          type="password"
          value={password}
        />
        <Input
          autoComplete="new-password"
          label="Confirm password"
          maxLength={72}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your password"
          required
          type="password"
          value={confirmPassword}
        />
        <Checkbox
          checked={termsAccepted}
          label="I accept the terms for using Doc Explain."
          onChange={(event) => setTermsAccepted(event.target.checked)}
          required
        />
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <Button
          className="w-full"
          icon={<UserPlus className="h-4 w-4" />}
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          Sign up
        </Button>
      </form>
    </AuthFormShell>
  );
}
