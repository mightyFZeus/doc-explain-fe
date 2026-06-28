import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  description,
  icon: Icon,
  label,
  progress,
  value,
}: {
  description: string;
  icon: LucideIcon;
  label: string;
  progress: string;
  value: string;
}) {
  const hasProgress = progress !== "0%";

  return (
    <article className="group rounded-[1.125rem] border border-line bg-paper p-4 shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/45 hover:shadow-[0_18px_44px_oklch(0.13_0.006_260_/_0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {label}
          </p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">
            {value}
          </p>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink transition-colors group-hover:border-ink/45">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 min-h-5 text-sm leading-5 text-muted">{description}</p>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/6">
        <div
          className={cn(
            "h-full rounded-full bg-ink transition-[width] duration-300",
            hasProgress ? "" : "opacity-0",
          )}
          style={{ width: progress }}
        />
      </div>
    </article>
  );
}
