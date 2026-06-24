import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn("focus-ring inline-flex items-center gap-3 rounded-md", className)}
      href={ROUTES.home}
    >
      <span className="grid h-9 w-9 place-items-center rounded-md border border-ink bg-ink text-sm font-semibold text-inverse">
        DE
      </span>
      <span className="text-sm font-semibold tracking-normal text-ink">
        Doc Explain
      </span>
    </Link>
  );
}
