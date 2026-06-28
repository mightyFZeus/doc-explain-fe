"use client";

import { type FormEvent, useState } from "react";
import {
  CalendarDays,
  Clock3,
  KeyRound,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
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

function SettingsCard({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: typeof UserRound;
  title: string;
}) {
  return (
    <section className="rounded-[1.35rem] border border-line bg-paper p-5 shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)]">
      <div className="mb-5 flex items-start gap-3 border-b border-line pb-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-inverse">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function AccountDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [requestPasswordReset, { isLoading: isRequestingReset }] =
    useRequestPasswordResetMutation();

  const [fullNameDraft, setFullNameDraft] = useState<string>();
  const [emailDraft, setEmailDraft] = useState<string>();
  const [resetEmailDraft, setResetEmailDraft] = useState<string>();
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const fullName = fullNameDraft ?? user?.fullName ?? "";
  const email = emailDraft ?? user?.email ?? "";
  const resetEmail = resetEmailDraft ?? user?.email ?? "";

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
    setFullNameDraft(fullName.trim());
    setEmailDraft(email.trim());
    setResetEmailDraft(email.trim());
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
            Keep your profile readable, request password resets, and tune the
            workspace defaults you use most.
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <SettingsCard
            description="Update the account details shown inside the workspace."
            icon={UserRound}
            title="Profile"
          >
            <form className="space-y-5" onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  onChange={(event) => setFullNameDraft(event.target.value)}
                  placeholder="Your name"
                  value={fullName}
                />
                <Input
                  label="Email address"
                  onChange={(event) => setEmailDraft(event.target.value)}
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
          </SettingsCard>

          <SettingsCard
            description="Send a reset request to the email address on your account."
            icon={KeyRound}
            title="Password reset"
          >
            <form className="space-y-5" onSubmit={handlePasswordReset}>
              <Input
                label="Reset email"
                onChange={(event) => setResetEmailDraft(event.target.value)}
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
          </SettingsCard>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[1.35rem] border border-line bg-paper p-5 shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)]">
            <div className="flex items-start gap-3 border-b border-line pb-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-inverse">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Signed in</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Your visible profile and session timeline.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <AccountDetail
                icon={UserRound}
                label="Name"
                value={user?.fullName || "Guest session"}
              />
              <AccountDetail
                icon={Mail}
                label="Email"
                value={user?.email || "Not available"}
              />
              <AccountDetail
                icon={CalendarDays}
                label="Created"
                value={formatDate(user?.createdAt)}
              />
              <AccountDetail
                icon={Clock3}
                label="Last updated"
                value={formatDate(user?.updatedAt)}
              />
            </div>
          </section>

          <section className="rounded-[1.35rem] border border-line bg-paper p-5 shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)]">
            <div className="flex items-start gap-3 border-b border-line pb-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-inverse">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Preferences</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Defaults for everyday document work.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-line bg-canvas p-4">
                <Checkbox
                  defaultChecked
                  label="Keep document conversation history visible."
                />
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-4">
                <Checkbox
                  defaultChecked
                  label="Use compact cards on smaller screens."
                />
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-4">
                <Checkbox label="Email me when a document finishes processing." />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
