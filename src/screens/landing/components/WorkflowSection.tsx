import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  UploadCloud,
} from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    label: "Upload",
    title: "Add the source",
    body: "Choose the file from the dashboard. It becomes its own workspace.",
  },
  {
    icon: CheckCircle2,
    label: "Index",
    title: "Watch readiness",
    body: "Live status updates show when the document is still being processed.",
  },
  {
    icon: MessageSquareText,
    label: "Ask",
    title: "Continue the thread",
    body: "Questions, streaming answers, copy actions, and retries stay in the same chat.",
  },
];

function WorkflowBoard() {
  return (
    <div className="rounded-[1.35rem] border border-line bg-paper p-3">
      <div className="overflow-hidden rounded-2xl border border-line bg-canvas">
        <div className="grid border-b border-line lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              className="border-b border-line p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              key={step.label}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-paper px-3 text-xs font-semibold text-muted">
                  <step.icon className="h-3.5 w-3.5" />
                  {step.label}
                </span>
                <span className="text-sm font-semibold text-ink/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
            <p className="text-sm font-semibold text-ink">Recent documents</p>
            <div className="mt-4 space-y-3">
              {[
                ["Board consent", "Legal", "Ready", false],
                ["Q2 vendor invoices", "Finance", "Ready", false],
                ["Migration notes", "Technical", "Live indexing", true],
              ].map(([title, type, status, isLoading]) => (
                <div
                  className="rounded-xl border border-line bg-paper p-3"
                  key={String(title)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-ink">{title}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      {status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted">{type}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ink p-5 text-inverse">
            <div className="flex items-center justify-between gap-4 border-b border-inverse/15 pb-4">
              <div>
                <p className="text-xs font-medium text-inverse/55">
                  Current question
                </p>
                <p className="mt-1 text-lg font-semibold">
                  Does it mention a dating policy?
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-inverse/60" />
            </div>
            <div className="mt-5 rounded-2xl border border-inverse/15 bg-inverse/10 p-4">
              <p className="text-sm leading-7 text-inverse/78">
                The available excerpts do not mention a dating policy. They
                focus on sustainability, health and safety, quality management,
                information security, and diversity.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Copy answer", "Retry if needed", "Keep history"].map((item) => (
                  <span
                    className="rounded-full border border-inverse/15 px-3 py-1 text-xs text-inverse/70"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" id="workflow">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Workflow
            </p>
            <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-[1.02] text-ink">
              From waiting on a file to asking the next question.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted lg:justify-self-end">
            Documents move from upload to indexing to chat without making the
            user refresh the page or guess what is happening in the background.
          </p>
        </div>

        <WorkflowBoard />
      </div>
    </section>
  );
}
