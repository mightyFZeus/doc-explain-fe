import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium transition-colors disabled:pointer-events-none disabled:opacity-55 [&_svg]:shrink-0",
    {
      "border-ink bg-ink text-inverse hover:bg-ink/90": variant === "primary",
      "border-line bg-canvas text-ink hover:border-ink": variant === "secondary",
      "border-transparent bg-transparent text-ink hover:bg-ink/5":
        variant === "ghost",
      "border-inverse bg-inverse text-ink hover:bg-inverse/90":
        variant === "inverse",
      "h-9 px-3 text-sm": size === "sm",
      "h-11 px-5 text-sm": size === "md",
      "h-12 px-6 text-base": size === "lg",
    },
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions & {
    isLoading?: boolean;
    icon?: ReactNode;
  };

export function Button({
  children,
  className,
  icon,
  isLoading,
  size,
  variant,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{isLoading ? "Please wait" : children}</span>
    </button>
  );
}

type LinkButtonProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps &
  ButtonStyleOptions & {
    showArrow?: boolean;
  };

export function LinkButton({
  children,
  className,
  showArrow,
  size,
  variant,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      {children}
      {showArrow ? <ArrowRight className="h-4 w-4 shrink-0" /> : null}
    </Link>
  );
}
