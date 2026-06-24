import Link from "next/link";
import { Menu } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { LinkButton } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: ROUTES.dashboard, label: "Dashboard" },
];

export function MarketingHeader() {
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
          <LinkButton href={ROUTES.login} size="sm" variant="ghost">
            Login
          </LinkButton>
          <LinkButton href={ROUTES.signup} size="sm" variant="primary">
            Get Started
          </LinkButton>
        </div>
        <button
          aria-label="Open navigation"
          className="focus-ring inline-grid h-10 w-10 place-items-center rounded-md border border-line md:hidden"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
