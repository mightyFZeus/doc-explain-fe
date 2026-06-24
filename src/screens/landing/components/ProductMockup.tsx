import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  FolderOpen,
  MessageSquareText,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";

const documents = [
  {
    title: "Lagos tenancy law",
    classification: "legal",
    status: "Ready",
    summary: "Notices, tenancy obligations, recovery of premises.",
  },
  {
    title: "Founder SAFE draft",
    classification: "finance",
    status: "Ready",
    summary: "Valuation cap, investor rights, conversion terms.",
  },
  {
    title: "Technical onboarding notes",
    classification: "technical",
    status: "Processing",
    summary: "Setup decisions, rollout notes, ownership history.",
  },
];

const facts = [
  ["Classification", "Legal"],
  ["Indexed", "37 chunks"],
  ["Confidence", "92 percent"],
];

function DocumentRail() {
  return (
    <aside className="border-b border-line bg-paper lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-inverse">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Library</p>
            <p className="text-xs text-muted">Three recent documents</p>
          </div>
        </div>
        <button
          aria-label="Add document preview"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-3">
        {documents.map((document, index) => (
          <button
            className={[
              "w-full rounded-xl border p-3 text-left transition-colors",
              index === 0
                ? "border-ink bg-ink text-inverse"
                : "border-line bg-canvas text-ink",
            ].join(" ")}
            key={document.title}
            type="button"
          >
            <div className="flex items-start gap-3">
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                  index === 0
                    ? "border-inverse/20 bg-inverse/10"
                    : "border-line bg-paper",
                ].join(" ")}
              >
                <FileText className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{document.title}</span>
                  <span
                    className={[
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      index === 0
                        ? "border-inverse/20 text-inverse/70"
                        : "border-line text-muted",
                    ].join(" ")}
                  >
                    {document.status}
                  </span>
                </span>
                <span
                  className={[
                    "mt-1 line-clamp-2 block text-xs leading-5",
                    index === 0 ? "text-inverse/68" : "text-muted",
                  ].join(" ")}
                >
                  {document.summary}
                </span>
                <span
                  className={[
                    "mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                    index === 0
                      ? "border-inverse/20 bg-inverse/10 text-inverse"
                      : "border-line bg-paper text-ink",
                  ].join(" ")}
                >
                  {document.classification}
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function DocumentInsight() {
  return (
    <section className="bg-[oklch(0.982_0.004_260)] p-4 lg:p-5">
      <div className="flex min-h-full flex-col gap-5">
        <div className="rounded-2xl border border-line bg-canvas p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Selected file
              </p>
              <h2 className="mt-2 truncate text-2xl font-semibold leading-tight text-ink">
                Lagos tenancy law
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
                A focused brief on tenancy agreements, notice periods, landlord
                obligations, and recovery procedures in Lagos State.
              </p>
            </div>
            <span className="inline-flex h-8 shrink-0 items-center rounded-full border border-ink bg-ink px-3 text-xs font-medium text-inverse">
              Ready
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {facts.map(([label, value]) => (
            <div className="rounded-xl border border-line bg-canvas p-4" key={label}>
              <p className="text-xs font-medium text-muted">{label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-xl border border-line bg-canvas p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4" />
              Scoped answers
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              If the answer is missing from the document, Doc Explain says so.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-4">
            <div className="h-2 rounded-full bg-ink/10">
              <div className="h-full w-[92%] rounded-full bg-ink" />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Document understanding is ready for questions and follow-ups.
            </p>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-line bg-canvas p-4">
          <p className="text-sm font-semibold text-ink">Source preview</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            It shall be unlawful for a landlord or agent to demand or receive
            rent in excess of the permitted period...
          </p>
        </div>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <section className="border-t border-line bg-paper p-4 lg:border-l lg:border-t-0 lg:p-5">
      <div className="flex min-h-full flex-col rounded-2xl border border-line bg-canvas shadow-[0_18px_55px_oklch(0.13_0.006_260_/_0.08)]">
        <div className="flex items-center justify-between gap-4 border-b border-line p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-inverse">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">Conversation</p>
              <p className="text-xs text-muted">Previous messages restored</p>
            </div>
          </div>
          <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-muted">
            legal
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="ml-auto max-w-[82%] rounded-2xl bg-ink px-4 py-3 text-sm leading-6 text-inverse">
            Can the landlord collect rent yearly?
          </div>
          <div className="max-w-[92%] text-sm leading-7 text-ink">
            The document says advance rent limits depend on the tenancy type.
            It separates yearly rent from shorter tenancy arrangements.
            <span className="ml-1 whitespace-nowrap text-muted">[chunk 12]</span>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <button
              aria-label="Copy response preview"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper"
              type="button"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              aria-label="Copied response preview"
              className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper"
              type="button"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3 text-xs leading-5 text-muted">
            Source: demand or receive rent in excess of the permitted period...
          </div>
          <div className="max-w-[92%] rounded-xl border border-line bg-paper p-3 text-sm leading-6 text-ink">
            Response failed.
            <button
              aria-label="Retry response preview"
              className="ml-2 inline-grid h-7 w-7 place-items-center rounded-full border border-line align-middle text-muted"
              type="button"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="border-t border-line p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-paper p-2">
            <div className="min-h-10 flex-1 px-3 py-2 text-sm text-muted">
              Ask anything about this document
            </div>
            <button
              aria-label="Send message preview"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-inverse"
              type="button"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductMockup() {
  return (
    <div className="relative mt-12 lg:mt-16">
      <div className="overflow-hidden rounded-[1.35rem] border border-inverse/20 bg-[oklch(0.985_0.004_260)] text-ink shadow-[0_32px_110px_oklch(0.03_0.006_260_/_0.42)]">
        <div className="flex min-h-14 flex-col gap-3 border-b border-line bg-paper px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/35" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            </div>
            <div className="hidden h-6 w-px bg-line sm:block" />
            <p className="text-xs font-medium text-muted">Doc Explain workspace</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-muted sm:max-w-xs">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Search inside one selected document</span>
          </div>
        </div>

        <div className="grid min-h-[620px] lg:grid-cols-[280px_minmax(0,1fr)_390px]">
          <DocumentRail />
          <DocumentInsight />
          <ChatPreview />
        </div>
      </div>
    </div>
  );
}
