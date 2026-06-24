import {
  CopyCheck,
  FileSearch,
  MessageSquareText,
  ShieldCheck,
  Tags,
} from "lucide-react";

const featureRows = [
  {
    icon: FileSearch,
    title: "Open the exact file",
    body: "Each document gets its own workspace, so answers stay tied to the source you selected.",
  },
  {
    icon: Tags,
    title: "See the type before you ask",
    body: "Classification, status, and summary help you understand what the system found.",
  },
  {
    icon: MessageSquareText,
    title: "Continue from history",
    body: "Return to a document and pick up from the previous questions already asked there.",
  },
  {
    icon: CopyCheck,
    title: "Use the answer immediately",
    body: "Copy a response, retry a failed one, and keep moving without leaving the page.",
  },
];

function DocumentProfileMock() {
  return (
    <div className="rounded-[1.35rem] border border-line bg-canvas p-3 shadow-[0_22px_70px_oklch(0.13_0.006_260_/_0.09)]">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-medium text-muted">Selected document</p>
            <h3 className="mt-1 max-w-xs truncate text-xl font-semibold text-ink">
              Founder SAFE draft
            </h3>
          </div>
          <span className="rounded-full border border-ink bg-ink px-3 py-1 text-xs font-medium text-inverse">
            Finance
          </span>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-ink">What Doc Explain found</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              A financing agreement with conversion language, valuation cap
              terms, investor rights, and signature requirements.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {["Valuation cap", "Discount", "Conversion", "Investor rights"].map(
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
              Source guard
            </div>
            <p className="mt-4 text-sm leading-7 text-inverse/72">
              When the file does not contain an answer, the assistant should say
              that instead of filling the gap.
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
              Review the file before you trust the answer.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              The workspace starts with visible document context, then moves into
              chat. That keeps the experience grounded before the first question
              is asked.
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
