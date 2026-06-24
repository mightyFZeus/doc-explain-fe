import Link from "next/link";
import { ArrowUpRight, FileText, Loader2, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { DocumentRecord } from "@/types/apiTypes";

const getClassification = (document: DocumentRecord) =>
  document.classification?.trim() || "unclassified";

const getStatus = (document: DocumentRecord) =>
  document.proccessingStatus || document.status || "uploaded";

const getStatusLabel = (status: string) =>
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date?: string) => {
  if (!date) {
    return "Recently added";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export function DocumentCard({
  document,
  isDeleting = false,
  onDelete,
}: {
  document: DocumentRecord;
  isDeleting?: boolean;
  onDelete: (document: DocumentRecord) => void;
}) {
  const classification = getClassification(document);
  const status = getStatus(document);
  const isReady = ["ready", "completed", "success"].includes(status.toLowerCase());
  const title = document.title || document.originalFilename || "Untitled document";

  return (
    <article className="group relative flex min-h-60 flex-col rounded-2xl border border-line bg-paper transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_18px_55px_oklch(0.13_0.006_260_/_0.12)]">
      <button
        aria-label={`Delete ${title}`}
        className="focus-ring absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas text-muted transition-colors hover:border-ink hover:text-ink"
        disabled={isDeleting}
        onClick={() => onDelete(document)}
        type="button"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
      </button>

      <Link
        className="focus-ring flex flex-1 flex-col rounded-2xl p-5"
        href={ROUTES.document(document.id)}
      >
        <div className="flex items-start gap-3 pr-10">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-inverse">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                isReady
                  ? "border-ink bg-ink text-inverse"
                  : "border-line bg-canvas text-muted",
              )}
            >
              {getStatusLabel(status)}
            </span>
            <h3 className="mt-4 line-clamp-2 text-xl font-semibold leading-7 text-ink">
              {title}
            </h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">
          {document.summary ||
            document.originalFilename ||
            "Ready for focused questions, sourced answers, and continued conversation history."}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold capitalize text-ink">
            {classification}
          </span>
          <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted">
            {document.fileType || document.sourceType || "Document"}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
          <span>{formatDate(document.createdAt)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            Open
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
