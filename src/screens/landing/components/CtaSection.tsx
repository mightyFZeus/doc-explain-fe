import { ArrowUp, FileUp, MessageCircle, Settings } from "lucide-react";
import { LinkButton } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";

const previewItems = [
  { icon: FileUp, label: "Add document", value: "Choose the file" },
  { icon: MessageCircle, label: "Ask questions", value: "Stay inside the source" },
  { icon: Settings, label: "Account settings", value: "Profile and password tools" },
];

export function CtaSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] border border-ink bg-ink text-inverse shadow-[0_32px_90px_oklch(0.13_0.006_260_/_0.18)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="p-8 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-inverse/55">
              Ready when the file is
            </p>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-inverse">
              Drop in the file that keeps coming up.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-inverse/65">
              Give it a workspace, ask the first question, and keep every answer
              close to the source that produced it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={ROUTES.signup} showArrow size="lg" variant="inverse">
                Create workspace
              </LinkButton>
              <LinkButton
                className="border-inverse/20 text-inverse hover:bg-inverse/10"
                href={ROUTES.dashboard}
                size="lg"
                variant="ghost"
              >
                Open dashboard
              </LinkButton>
            </div>
          </div>

          <div className="border-t border-inverse/15 bg-inverse/[0.03] p-5 lg:border-l lg:border-t-0">
            <div className="flex h-full min-h-80 flex-col justify-between rounded-[1.25rem] border border-inverse/15 bg-ink p-5">
              <div className="space-y-3">
                {previewItems.map((item) => (
                  <div
                    className="flex items-center gap-3 border-b border-inverse/10 pb-3 last:border-b-0"
                    key={item.label}
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-inverse text-ink">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs text-inverse/55">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-[1.2rem] border border-inverse/15 bg-inverse p-2 text-ink">
                <div className="flex min-h-12 items-center gap-3 rounded-[0.95rem] px-3">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted">
                    Ask anything about this document
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-inverse">
                    <ArrowUp className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
