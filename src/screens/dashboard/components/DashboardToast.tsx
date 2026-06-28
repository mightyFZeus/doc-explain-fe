import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardToastTone = "error" | "info" | "success";

export interface DashboardToastMessage {
  id: number;
  message: string;
  tone: DashboardToastTone;
}

export function DashboardToast({
  toast,
}: {
  toast: DashboardToastMessage | null;
}) {
  if (!toast) {
    return null;
  }

  const Icon =
    toast.tone === "success"
      ? CheckCircle2
      : toast.tone === "error"
        ? AlertCircle
        : Loader2;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-3 text-sm font-medium text-ink shadow-[0_18px_50px_oklch(0.13_0.006_260_/_0.14)]",
          toast.tone === "error"
            ? "border-danger-line bg-danger-surface text-danger"
            : "",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            toast.tone === "info" ? "animate-spin text-muted" : "",
            toast.tone === "success" ? "text-ink" : "",
            toast.tone === "error" ? "text-danger" : "",
          )}
        />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
