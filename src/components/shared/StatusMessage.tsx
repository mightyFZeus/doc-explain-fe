import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "error" | "info";

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function StatusMessage({
  children,
  className,
  tone = "info",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: StatusTone;
}) {
  const Icon = iconMap[tone];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink",
        tone === "error" ? "border-ink" : "",
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
