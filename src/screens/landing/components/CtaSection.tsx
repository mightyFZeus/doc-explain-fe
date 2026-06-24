import { FileUp, MessageCircle, Settings } from "lucide-react";
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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.4rem] border border-ink bg-paper">
        <div className="grid lg:grid-cols-[1fr_420px]">
          <div className="p-8 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Ready when the file is
            </p>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-ink">
              Bring the document. Leave with the answer.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
              Start with one file, open its workspace, and keep every question
              attached to the document that made it necessary.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={ROUTES.signup} showArrow size="lg">
                Create workspace
              </LinkButton>
              <LinkButton href={ROUTES.dashboard} size="lg" variant="secondary">
                Open dashboard
              </LinkButton>
            </div>
          </div>

          <div className="border-t border-line bg-ink p-5 text-inverse lg:border-l lg:border-t-0">
            <div className="flex h-full min-h-80 flex-col justify-between rounded-2xl border border-inverse/15 bg-inverse/10 p-5">
              <div className="space-y-3">
                {previewItems.map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-inverse/15 bg-ink p-4"
                    key={item.label}
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-inverse text-ink">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs text-inverse/60">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-3xl font-semibold leading-tight">
                A compact workspace for questions that should not drift away
                from the source.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
