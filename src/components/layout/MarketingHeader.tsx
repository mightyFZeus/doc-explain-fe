"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { LinkButton } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { GuestTrialButton } from "@/screens/auth/components/GuestTrialButton";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: ROUTES.dashboard, label: "Dashboard" },
];

export function MarketingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MenuIcon = isMenuOpen ? X : Menu;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {navItems.map((item) => (
            <Link
              className="focus-ring rounded-md transition-colors hover:text-ink"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <GuestTrialButton label="Try it out" size="sm" variant="secondary" />
          <LinkButton href={ROUTES.login} size="sm" variant="ghost">
            Login
          </LinkButton>
          <LinkButton href={ROUTES.signup} size="sm" variant="primary">
            Get Started
          </LinkButton>
        </div>
        <button
          aria-controls="mobile-marketing-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          className="focus-ring inline-grid h-10 w-10 place-items-center rounded-md border border-line md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
      {isMenuOpen ? (
        <div
          className="border-t border-line bg-canvas px-4 py-4 shadow-[0_18px_50px_oklch(0.13_0.006_260_/_0.08)] md:hidden"
          id="mobile-marketing-navigation"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium text-ink">
            {navItems.map((item) => (
              <Link
                className="focus-ring rounded-md px-2 py-3 transition-colors hover:bg-ink/5"
                href={item.href}
                key={item.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto mt-4 grid max-w-7xl gap-2">
            <GuestTrialButton
              className="w-full"
              label="Try it out"
              size="md"
              variant="secondary"
            />
            <LinkButton
              className="w-full"
              href={ROUTES.login}
              onClick={() => setIsMenuOpen(false)}
              size="md"
              variant="secondary"
            >
              Login
            </LinkButton>
            <LinkButton
              className="w-full"
              href={ROUTES.signup}
              onClick={() => setIsMenuOpen(false)}
              size="md"
              variant="primary"
            >
              Get Started
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
