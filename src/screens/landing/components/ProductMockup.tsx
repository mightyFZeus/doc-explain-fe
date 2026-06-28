import {
  ArrowUp,
  Copy,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const sourceNotes = ["Policy scope", "Confidentiality", "Diversity"];

function DocumentPreview() {
  return (
    <aside className="flex min-h-[22rem] flex-col justify-between rounded-[1.25rem] bg-ink p-5 text-inverse">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-inverse text-ink">
            <FileText className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-inverse/15 px-3 py-1 text-xs font-medium text-inverse/70">
            <Loader2 className="h-3 w-3 animate-spin" />
            Live indexing
          </span>
        </div>

        <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-inverse/45">
          Selected document
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight">
          Company policy.pdf
        </h3>
        <p className="mt-3 text-sm leading-6 text-inverse/65">
          Classified as policy, indexed into searchable chunks, and ready for
          grounded questions.
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-inverse/12">
          <div className="h-full w-4/5 rounded-full bg-inverse" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2">
        {[
          ["Status", "Ready"],
          ["Chunks", "48"],
          ["Class", "Policy"],
          ["History", "On"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-inverse/12 bg-inverse/[0.06] p-3"
            key={label}
          >
            <p className="text-[11px] font-medium text-inverse/45">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function UserPrompt() {
  return (
    <div className="flex justify-end">
      <div className="max-w-[86%] rounded-[1.2rem] bg-ink px-5 py-3 text-sm font-semibold lowercase leading-6 text-inverse sm:max-w-[68%]">
        does it talk about dating policy?
      </div>
    </div>
  );
}

function AnswerPreview() {
  return (
    <div className="max-w-3xl">
      <p className="text-base font-medium leading-8 text-ink sm:text-lg sm:leading-9">
        The document excerpts do not mention a dating policy. They focus on
        sustainability, health and safety, quality management, information
        security, and diversity.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          aria-label="Copy response preview"
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-muted transition-colors hover:text-ink"
          type="button"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          aria-label="Retry response preview"
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-muted transition-colors hover:text-ink"
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-2 text-xs font-medium text-muted">
          <Sparkles className="h-3.5 w-3.5" />
          Streamed answer
        </span>
      </div>
    </div>
  );
}

function SourceShelf() {
  return (
    <div className="rounded-[1.15rem] border border-line bg-paper p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheck className="h-4 w-4" />
          Source guard is on
        </div>
        <div className="flex flex-wrap gap-2">
          {sourceNotes.map((note) => (
            <span
              className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted"
              key={note}
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComposerPreview() {
  return (
    <div className="rounded-[1.25rem] border border-line bg-paper p-2 shadow-[0_18px_55px_oklch(0.13_0.006_260_/_0.1)]">
      <div className="flex min-h-[3.25rem] items-center gap-3 px-3">
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted">
          Ask anything about this document
        </span>
        <button
          aria-label="Send message preview"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/45 text-inverse"
          type="button"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ProductMockup() {
  return (
    <div className="relative mx-auto mt-9 max-w-6xl lg:mt-12">
      <div className="rounded-[1.55rem] border border-line bg-paper p-3 shadow-[0_28px_90px_oklch(0.13_0.006_260_/_0.12)]">
        <div className="grid gap-3 lg:grid-cols-[320px_minmax(0,1fr)]">
          <DocumentPreview />

          <section className="flex min-h-[22rem] flex-col justify-between rounded-[1.25rem] border border-line bg-[oklch(0.987_0.004_260)] p-5 sm:p-6">
            <div className="space-y-7">
              <UserPrompt />
              <AnswerPreview />
              <SourceShelf />
            </div>

            <div className="mt-7">
              <ComposerPreview />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
