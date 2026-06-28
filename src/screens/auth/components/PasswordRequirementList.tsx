"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PasswordValidation = {
  hasLowercase: boolean;
  hasUppercase: boolean;
  isEightChar: boolean;
  isNum: boolean;
  isSpecial: boolean;
};

const requirements: Array<{
  key: keyof PasswordValidation;
  label: string;
}> = [
  { key: "isEightChar", label: "At least 12 characters" },
  { key: "isNum", label: "One number" },
  { key: "isSpecial", label: "One special character" },
  { key: "hasUppercase", label: "One uppercase letter" },
  { key: "hasLowercase", label: "One lowercase letter" },
];

export function PasswordRequirementList({
  validation,
}: {
  validation: PasswordValidation;
}) {
  return (
    <div
      aria-label="Password requirements"
      aria-live="polite"
      className="flex flex-wrap gap-x-4 gap-y-2"
    >
      {requirements.map((requirement) => {
        const isValid = validation[requirement.key];

        return (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              isValid ? "text-ink" : "text-muted",
            )}
            key={requirement.key}
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-colors",
                isValid ? "text-ink" : "text-muted/55",
              )}
            />
            <span>{requirement.label}</span>
          </div>
        );
      })}
    </div>
  );
}
