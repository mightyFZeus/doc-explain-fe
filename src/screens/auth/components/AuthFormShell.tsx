import Link from "next/link";
import { FileText, MessageSquareText, UploadCloud } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ROUTES } from "@/constants/routes";

const proofPoints = [
  { icon: UploadCloud, label: "Upload" },
  { icon: FileText, label: "Index" },
  { icon: MessageSquareText, label: "Ask" },
];

export function AuthFormShell({
  children,
  footer,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="flex min-h-screen flex-col px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            className="focus-ring rounded-md text-sm font-medium text-muted transition-colors hover:text-ink"
            href={ROUTES.home}
          >
            Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-semibold leading-tight text-ink">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted">{subtitle}</p>
            </div>
            {children}
            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </div>
      </section>
      <aside className="hidden min-h-screen bg-ink p-8 text-inverse lg:flex lg:flex-col lg:justify-between">
        <div />
        <div>
          <p className="max-w-sm text-5xl font-semibold leading-[1.02]">
            Keep the document close to every answer.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {proofPoints.map((item) => (
              <div
                className="rounded-md border border-inverse/15 bg-inverse/5 p-4"
                key={item.label}
              >
                <item.icon className="h-5 w-5" />
                <p className="mt-6 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-inverse/55">
          Built for registration, uploads, and source-grounded document search.
        </p>
      </aside>
    </main>
  );
}
