import Link from "next/link";

export function AuthFooterLink({
  href,
  label,
  prompt,
}: {
  href: string;
  label: string;
  prompt: string;
}) {
  return (
    <p className="text-center text-sm text-muted">
      {prompt}{" "}
      <Link
        className="focus-ring rounded-md font-semibold text-ink underline-offset-4 hover:underline"
        href={href}
      >
        {label}
      </Link>
    </p>
  );
}
