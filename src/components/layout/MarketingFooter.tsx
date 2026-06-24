import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Logo } from "@/components/shared/Logo";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: ROUTES.login, label: "Login" },
  { href: ROUTES.signup, label: "Sign up" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-6 text-muted">
            Grounded document answers for teams that need the source in view.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted sm:grid-cols-4">
          {footerLinks.map((item) => (
            <Link
              className="focus-ring rounded-md transition-colors hover:text-ink"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
