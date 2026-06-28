import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  getDocumentStatus,
  getDocumentStatusLabel,
  isDocumentFailedStatus,
  isDocumentProcessingStatus,
  isDocumentReadyStatus,
} from "@/lib/documentStatus";
import { cn } from "@/lib/utils";
import type { DocumentRecord } from "@/types/apiTypes";

const getClassification = (document: DocumentRecord) =>
  document.classification?.trim() || "unclassified";

const getStatusMeta = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (isDocumentReadyStatus(normalizedStatus)) {
    return {
      icon: CheckCircle2,
      label: "Ready",
      loading: false,
      tone: "solid" as const,
    };
  }

  if (isDocumentProcessingStatus(normalizedStatus)) {
    return {
      icon: Loader2,
      label: normalizedStatus === "uploaded" ? "Queued" : "Indexing",
      loading: true,
      tone: "muted" as const,
    };
  }

  if (isDocumentFailedStatus(normalizedStatus)) {
    return {
      icon: CircleAlert,
      label: "Needs review",
      loading: false,
      tone: "outline" as const,
    };
  }

  return {
    icon: FileText,
    label: getDocumentStatusLabel(status),
    loading: false,
    tone: "muted" as const,
  };
};

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

function StatusPill({
  isLiveUpdating = false,
  status,
}: {
  isLiveUpdating?: boolean;
  status: string;
}) {
  const statusMeta = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        statusMeta.tone === "solid"
          ? "border-ink bg-ink text-inverse"
          : "border-line bg-canvas text-muted",
        statusMeta.tone === "outline" ? "border-ink bg-paper text-ink" : "",
      )}
    >
      <statusMeta.icon
        className={cn("h-3.5 w-3.5", statusMeta.loading ? "animate-spin" : "")}
      />
      {isLiveUpdating && statusMeta.loading ? "Live indexing" : statusMeta.label}
    </span>
  );
}

function MetaPill({
  children,
  isStrong = false,
}: {
  children: React.ReactNode;
  isStrong?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-xs",
        isStrong ? "font-semibold capitalize text-ink" : "font-medium text-muted",
      )}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="font-medium uppercase tracking-[0.14em] text-ink/50">
        {label}
      </span>
      <span className="max-w-28 truncate text-ink/75">{value}</span>
    </span>
  );
}

function ProcessingStatus({
  isLiveUpdating = false,
  status,
}: {
  isLiveUpdating?: boolean;
  status: string;
}) {
  return (
    <div
      aria-live="polite"
      className="mt-5 rounded-2xl border border-line bg-canvas p-3"
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-2 font-semibold text-ink">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {isLiveUpdating ? "Listening for completion" : "Processing document"}
        </span>
        <span className="shrink-0 font-medium text-muted">
          {getDocumentStatusLabel(status)}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/8">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-ink" />
      </div>
    </div>
  );
}

export function DocumentCard({
  document,
  isDeleting = false,
  isLiveUpdating = false,
  onBlockedOpen,
  onDelete,
}: {
  document: DocumentRecord;
  isDeleting?: boolean;
  isLiveUpdating?: boolean;
  onBlockedOpen?: (document: DocumentRecord) => void;
  onDelete: (document: DocumentRecord) => void;
}) {
  const classification = getClassification(document);
  const status = getDocumentStatus(document);
  const isProcessing = isDocumentProcessingStatus(status);
  const title = document.title || document.originalFilename || "Untitled document";
  const detailItems = [
    {
      label: "Type",
      value: document.fileType || document.sourceType || "Document",
    },
    document.pageCount
      ? {
          label: "Pages",
          value: String(document.pageCount),
        }
      : undefined,
    document.chunkCount
      ? {
          label: "Chunks",
          value: String(document.chunkCount),
        }
      : undefined,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="group relative flex min-h-[17rem] flex-col overflow-hidden rounded-[1.35rem] border border-line bg-paper shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/55 hover:shadow-[0_22px_50px_oklch(0.13_0.006_260_/_0.1)]">
      <button
        aria-label={`Delete ${title}`}
        className="focus-ring absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-muted transition-colors hover:border-ink hover:bg-canvas hover:text-ink"
        disabled={isDeleting}
        onClick={() => onDelete(document)}
        type="button"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
      </button>

      <Link
        aria-disabled={isProcessing}
        className={cn(
          "focus-ring flex flex-1 flex-col rounded-[1.35rem] p-5 sm:p-6",
          isProcessing ? "cursor-not-allowed" : "",
        )}
        href={ROUTES.document(document.id)}
        onClick={(event) => {
          if (!isProcessing) {
            return;
          }

          event.preventDefault();
          onBlockedOpen?.(document);
        }}
      >
        <div className="flex items-start gap-3 pr-9">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <StatusPill isLiveUpdating={isLiveUpdating} status={status} />
              <MetaPill isStrong>{classification}</MetaPill>
            </div>
            <h3 className="mt-4 line-clamp-2 text-xl font-semibold leading-7 text-ink sm:text-[1.35rem]">
              {title}
            </h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
          {document.summary ||
            document.originalFilename ||
            "Ready for focused questions, sourced answers, and continued conversation history."}
        </p>

        {isProcessing ? (
          <ProcessingStatus isLiveUpdating={isLiveUpdating} status={status} />
        ) : null}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {detailItems.map((item) => (
            <DetailItem key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4 text-xs text-muted">
          <span className="min-w-0 truncate">{formatDate(document.createdAt)}</span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 font-semibold",
              isProcessing ? "text-muted" : "text-ink",
            )}
          >
            {isProcessing ? "Processing" : "Open chat"}
            {isProcessing ? (
              <Clock3 className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
          </span>
        </div>
      </Link>
    </article>
  );
}
