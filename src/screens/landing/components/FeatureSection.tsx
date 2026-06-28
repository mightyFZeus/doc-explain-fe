import {
  CopyCheck,
  FileSearch,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  Tags,
} from "lucide-react";

const featureRows = [
  {
    icon: FileSearch,
    title: "Scoped to one source",
    body: "The chat opens from a selected document, so answers do not drift across unrelated files.",
  },
  {
    icon: Tags,
    title: "Context before you ask",
    body: "Classification, status, and summary show what was understood before the first prompt.",
  },
  {
    icon: MessageSquareText,
    title: "History stays attached",
    body: "Open the document later and the previous messages come back with it.",
  },
  {
    icon: CopyCheck,
    title: "Actions stay close",
    body: "Copy useful responses, retry failed ones, and keep working in the same view.",
  },
];

function DocumentProfileMock() {
  return (
    <div className="rounded-[1.6rem] border border-line bg-canvas p-3 shadow-[0_22px_70px_oklch(0.13_0.006_260_/_0.08)]">
      <div className="overflow-hidden rounded-[1.3rem] border border-line bg-paper">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-medium text-muted">Selected document</p>
            <h3 className="mt-1 max-w-xs truncate text-xl font-semibold text-ink">
              Company policy.pdf
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-ink px-3 py-1 text-xs font-medium text-inverse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Live indexing
          </span>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p className="text-sm font-semibold text-ink">What Doc Explain found</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              A company policy covering sustainability, health and safety,
              environmental protection, quality management, information
              security, and diversity.
            </p>
            <div className="mt-5 rounded-2xl border border-line bg-canvas p-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-ink">Processing status</span>
                <span className="font-medium text-muted">Almost ready</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/8">
                <div className="h-full w-4/5 rounded-full bg-ink" />
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {["Sustainability", "Confidentiality", "Quality", "Diversity"].map(
                (item) => (
                  <span
                    className="rounded-full border border-line bg-canvas px-3 py-2 text-xs font-medium text-ink"
                    key={item}
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-ink p-4 text-inverse">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              No source, no claim
            </div>
            <p className="mt-4 text-sm leading-7 text-inverse/72">
              Ask about a missing dating policy and the answer says the document
              does not mention one.
            </p>
            <div className="mt-6 space-y-2">
              <div className="h-2 rounded-full bg-inverse/30" />
              <div className="h-2 w-10/12 rounded-full bg-inverse/20" />
              <div className="h-2 w-7/12 rounded-full bg-inverse/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureSection() {
  return (
    <section
      className="border-y border-line bg-paper px-4 py-20 sm:px-6 lg:px-8"
      id="features"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Document intelligence
            </p>
            <h2 className="mt-4 max-w-xl text-5xl font-semibold leading-[1.02] text-ink">
              It knows when to answer, and when to stop.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              Doc Explain is not a blank chatbot with a file attached. The
              document is the unit: its status, summary, chat, and history stay
              together.
            </p>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {featureRows.map((feature) => (
                <div className="grid gap-4 py-5 sm:grid-cols-[44px_1fr]" key={feature.title}>
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-canvas">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DocumentProfileMock />
        </div>
      </div>
    </section>
  );
}
