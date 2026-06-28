"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useLoginUserMutation, useRegisterUserMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";
import { AuthFooterLink } from "../components/AuthFooterLink";
import { AuthFormShell } from "../components/AuthFormShell";
import { PasswordInput } from "../components/PasswordInput";
import {
  PasswordRequirementList,
  type PasswordValidation,
} from "../components/PasswordRequirementList";

const getPasswordValidation = (password: string): PasswordValidation => ({
  isEightChar: password.length >= 12,
  isNum: /.*\d.*/.test(password),
  isSpecial: /.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-].*/.test(password),
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password) && password.length > 0,
});

export function SignUpScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isHydrated, token, user } = useAppSelector((state) => state.auth);
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const isLoading = isRegistering || isLoggingIn;
  const passwordValidation = useMemo(
    () => getPasswordValidation(password),
    [password],
  );
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword;
  const canSubmit =
    Boolean(fullName.trim() && email.trim()) &&
    isPasswordValid &&
    doPasswordsMatch &&
    termsAccepted &&
    !isLoading;

  useEffect(() => {
    if (isHydrated && user && token) {
      router.replace(ROUTES.dashboard);
    }
  }, [isHydrated, router, token, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Password must meet every requirement below.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Password and confirmation must match.");
      return;
    }

    try {
      const registeredUser = await registerUser({
        confirmPassword,
        email,
        fullName,
        password,
        termsAccepted,
      }).unwrap();
      const session = await loginUser({ email, password }).unwrap();
      const sessionToken = session.accessToken ?? session.token ?? null;

      if (!sessionToken) {
        throw new Error("Your account was created, but sign in did not return a session.");
      }

      dispatch(
        setSession({
          expiresAt: null,
          limits: null,
          trialUsage: null,
          token: sessionToken,
          user: session.user ?? registeredUser,
        }),
      );
      router.replace(ROUTES.dashboard);
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
        <PasswordInput
          autoComplete="new-password"
          label="Password"
          maxLength={72}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          required
          value={password}
        />
        <PasswordRequirementList validation={passwordValidation} />
        <PasswordInput
          autoComplete="new-password"
          error={
            confirmPassword && !doPasswordsMatch
              ? "Password and confirmation must match."
              : undefined
          }
          label="Confirm password"
          maxLength={72}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your password"
          required
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
          disabled={!canSubmit}
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
