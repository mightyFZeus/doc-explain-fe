"use client";

import { type FormEvent, useState } from "react";
import { KeyRound, LogOut, Save, ShieldCheck, UserRound } from "lucide-react";
import { useRequestPasswordResetMutation } from "@/api/authApi";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { Input } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, setUser } from "@/store/slices/authSlice";
import { DashboardShell } from "../components/DashboardShell";

function formatDate(date?: string) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [requestPasswordReset, { isLoading: isRequestingReset }] =
    useRequestPasswordResetMutation();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [resetEmail, setResetEmail] = useState(user?.email ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!fullName.trim() || !email.trim()) {
      setProfileError("Name and email are required.");
      return;
    }

    dispatch(
      setUser({
        id: user?.id ?? "local-user",
        fullName: fullName.trim(),
        email: email.trim(),
        termsAccepted: user?.termsAccepted ?? true,
        createdAt: user?.createdAt,
        updatedAt: new Date().toISOString(),
      }),
    );
    setResetEmail(email.trim());
    setProfileMessage("Profile saved for this session.");
  };

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");

    if (!resetEmail.trim()) {
      setResetError("Enter the email address for the reset link.");
      return;
    }

    try {
      await requestPasswordReset({ email: resetEmail.trim() }).unwrap();
      setResetMessage("Password reset instructions have been requested.");
    } catch (error) {
      setResetError(
        getApiErrorMessage(error, "Unable to request a password reset."),
      );
    }
  };

  return (
    <DashboardShell
      subtitle="Manage profile, security, and workspace preferences."
      title="Settings"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Settings
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">
            Account settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Keep your profile readable, request password resets, and control the
            workspace defaults used across Doc Explain.
          </p>
        </div>
        <Button
          icon={<LogOut className="h-4 w-4" />}
          onClick={() => dispatch(clearAuth())}
          type="button"
          variant="secondary"
        >
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-paper p-5">
            <div className="mb-5 flex items-start gap-3 border-b border-line pb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-inverse">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Profile</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  This controls the account details shown inside the workspace.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your name"
                  value={fullName}
                />
                <Input
                  label="Email address"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </div>

              {profileError ? (
                <StatusMessage tone="error">{profileError}</StatusMessage>
              ) : null}
              {profileMessage ? (
                <StatusMessage tone="success">{profileMessage}</StatusMessage>
              ) : null}

              <Button icon={<Save className="h-4 w-4" />} type="submit">
                Save profile
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-line bg-paper p-5">
            <div className="mb-5 flex items-start gap-3 border-b border-line pb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-inverse">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Password reset</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Send a reset request to the email address on your account.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handlePasswordReset}>
              <Input
                label="Reset email"
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={resetEmail}
              />

              {resetError ? (
                <StatusMessage tone="error">{resetError}</StatusMessage>
              ) : null}
              {resetMessage ? (
                <StatusMessage tone="success">{resetMessage}</StatusMessage>
              ) : null}

              <Button
                icon={<KeyRound className="h-4 w-4" />}
                isLoading={isRequestingReset}
                type="submit"
              >
                Send reset link
              </Button>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-inverse">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Account</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Current session details.
                </p>
              </div>
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-muted">User ID</dt>
                <dd className="mt-1 truncate font-medium text-ink">
                  {user?.id ?? "Local session"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Created</dt>
                <dd className="mt-1 font-medium text-ink">
                  {formatDate(user?.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Last updated</dt>
                <dd className="mt-1 font-medium text-ink">
                  {formatDate(user?.updatedAt)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="text-xl font-semibold text-ink">Preferences</h2>
            <div className="mt-5 space-y-4">
              <Checkbox defaultChecked label="Keep document conversation history visible." />
              <Checkbox defaultChecked label="Use compact cards on smaller screens." />
              <Checkbox label="Email me when a document finishes processing." />
            </div>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
