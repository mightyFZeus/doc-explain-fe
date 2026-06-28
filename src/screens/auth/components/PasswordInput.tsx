"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/shared/Input";

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  "rightElement" | "type"
>;

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <Input
      {...props}
      rightElement={
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="focus-ring grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:text-ink"
          onClick={() => setIsVisible((current) => !current)}
          onMouseDown={(event) => event.preventDefault()}
          title={isVisible ? "Hide password" : "Show password"}
          type="button"
        >
          <Icon className="h-4 w-4" />
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}
