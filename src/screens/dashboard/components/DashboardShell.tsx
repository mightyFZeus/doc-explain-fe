"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Loader2, LogOut, PanelLeft } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth } from "@/store/slices/authSlice";

const navItems = [
  { href: ROUTES.dashboard, label: "Documents", icon: FileText },
];

export function DashboardShell({
  children,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, token, user } = useAppSelector((state) => state.auth);
  const isAuthorized = Boolean(isHydrated && token && user);

  useEffect(() => {
    if (!isHydrated || isAuthorized) {
      return;
    }

    router.replace(`${ROUTES.login}?next=${encodeURIComponent(pathname)}`);
  }, [isAuthorized, isHydrated, pathname, router]);

  const isActive = (href: string) => {
    if (href === ROUTES.dashboard) {
      return pathname === ROUTES.dashboard || pathname.startsWith("/dashboard/documents");
    }

    return pathname === href;
  };

  if (!isAuthorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-3 text-sm font-medium text-muted shadow-[0_12px_40px_oklch(0.13_0.006_260_/_0.06)]">
          <Loader2 className="h-4 w-4 animate-spin text-ink" />
          Loading workspace
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line bg-ink p-5 text-inverse lg:flex lg:min-h-screen lg:flex-col">
        <div className="[&_*]:text-inverse">
          <Logo />
        </div>
        <nav className="mt-10 space-y-1">
          {navItems.map((item) => (
            <Link
              className={cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-inverse/70 transition-colors hover:bg-inverse/10 hover:text-inverse",
                isActive(item.href) ? "bg-inverse/12 text-inverse" : "",
              )}
              href={item.href}
              key={item.label}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                aria-label="Open dashboard navigation"
                className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-line"
                type="button"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
              <Logo />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-muted">{subtitle}</p>
            </div>
            <Button
              icon={<LogOut className="h-4 w-4" />}
              onClick={() => {
                dispatch(clearAuth());
                router.replace(ROUTES.login);
              }}
              size="sm"
              type="button"
              variant="secondary"
            >
              Sign out
            </Button>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-line px-4 py-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                className={cn(
                  "focus-ring inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-3 text-sm font-medium text-muted",
                  isActive(item.href) ? "border-ink bg-ink text-inverse" : "",
                )}
                href={item.href}
                key={item.label}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
