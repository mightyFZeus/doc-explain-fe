import { CalendarDays, FileText, Hash, Tag, X } from "lucide-react";
import {
  getDocumentStatus,
  getDocumentStatusLabel,
} from "@/lib/documentStatus";
import { cn } from "@/lib/utils";
import type { DocumentRecord } from "@/types/apiTypes";

const formatDate = (date?: string) => {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function DocumentInfoDrawer({
  document,
  isOpen,
  onClose,
}: {
  document?: DocumentRecord;
  isOpen: boolean;
  onClose: () => void;
}) {
  const title = document?.title || document?.originalFilename || "Document";
  const status = document ? getDocumentStatus(document) : "loading";

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-50 transition",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        aria-label="Close document info"
        className={cn(
          "absolute inset-0 bg-ink/20 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Document info"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-line bg-paper shadow-[0_24px_80px_oklch(0.13_0.006_260_/_0.18)] transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Document info
            </p>
            <h2 className="mt-2 truncate text-xl font-semibold text-ink">
              {title}
            </h2>
          </div>
          <button
            aria-label="Close document info"
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-canvas text-muted transition-colors hover:border-ink hover:text-ink"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="rounded-2xl border border-line bg-canvas px-4">
            <DetailRow
              icon={Tag}
              label="Classification"
              value={document?.classification || "Unclassified"}
            />
            <div className="border-t border-line" />
            <DetailRow
              icon={Hash}
              label="Pages"
              value={document?.pageCount ? String(document.pageCount) : "Not available"}
            />
            <div className="border-t border-line" />
            <DetailRow
              icon={CalendarDays}
              label="Uploaded"
              value={formatDate(document?.createdAt)}
            />
            <div className="border-t border-line" />
            <DetailRow
              icon={FileText}
              label="Status"
              value={getDocumentStatusLabel(status)}
            />
          </div>

          <section className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {document?.summary ||
                "No summary is available yet. It will appear after processing completes."}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
