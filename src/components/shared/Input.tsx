import {
  forwardRef,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from "react";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
};

function FieldShell({ children, error, hint, label }: FieldShellProps) {
  const id = useId();
  const descriptionId = hint || error ? `${id}-description` : undefined;

  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children(id, descriptionId)}
      {hint || error ? (
        <span
          className={cn(
            "block text-xs leading-5",
            error ? "text-ink" : "text-muted",
          )}
          id={descriptionId}
        >
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  rightElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, label, rightElement, ...props }, ref) => (
    <FieldShell error={error} hint={hint} label={label}>
      {(id, describedBy) => (
        <span className="relative block">
          <input
            aria-describedby={describedBy}
            className={cn(
              "focus-ring h-12 w-full rounded-md border border-line bg-canvas px-4 text-sm text-ink placeholder:text-muted transition-colors hover:border-ink/40",
              rightElement ? "pr-12" : "",
              error ? "border-ink" : "",
              className,
            )}
            id={id}
            ref={ref}
            {...props}
          />
          {rightElement ? (
            <span className="absolute inset-y-0 right-2 flex items-center">
              {rightElement}
            </span>
          ) : null}
        </span>
      )}
    </FieldShell>
  ),
);

Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, label, ...props }, ref) => (
    <FieldShell error={error} hint={hint} label={label}>
      {(id, describedBy) => (
        <textarea
          aria-describedby={describedBy}
          className={cn(
            "focus-ring min-h-32 w-full resize-y rounded-md border border-line bg-canvas px-4 py-3 text-sm leading-6 text-ink placeholder:text-muted transition-colors hover:border-ink/40",
            error ? "border-ink" : "",
            className,
          )}
          id={id}
          ref={ref}
          {...props}
        />
      )}
    </FieldShell>
  ),
);

Textarea.displayName = "Textarea";
