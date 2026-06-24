import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-muted">
      <input
        className={cn(
          "focus-ring mt-1 h-4 w-4 rounded border-line text-ink accent-[oklch(var(--ink))]",
          className,
        )}
        type="checkbox"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
