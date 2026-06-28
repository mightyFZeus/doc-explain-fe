import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/Button";
import type { DocumentRecord } from "@/types/apiTypes";
import { DocumentCard } from "./DocumentCard";

function DocumentSkeleton() {
  return (
    <div className="min-h-[17rem] rounded-[1.35rem] border border-line bg-paper p-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-ink/8" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-32 rounded-full bg-ink/8" />
          <div className="h-5 w-11/12 rounded-full bg-ink/12" />
          <div className="h-5 w-8/12 rounded-full bg-ink/10" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-3 w-full rounded-full bg-ink/8" />
        <div className="h-3 w-10/12 rounded-full bg-ink/8" />
        <div className="h-4 w-3/5 rounded-full bg-ink/10" />
      </div>
      <div className="mt-12 h-px bg-line" />
      <div className="mt-4 flex justify-between">
        <div className="h-3 w-24 rounded-full bg-ink/8" />
        <div className="h-3 w-20 rounded-full bg-ink/10" />
      </div>
    </div>
  );
}

export function DocumentLibrary({
  addDisabledMessage,
  deletingDocumentId,
  documents,
  isAddDisabled = false,
  isAdding,
  isFetching,
  liveDocumentIds,
  onAddNew,
  onBlockedDocumentOpen,
  onDeleteDocument,
  onRefresh,
}: {
  addDisabledMessage?: string;
  deletingDocumentId?: string;
  documents: DocumentRecord[];
  isAddDisabled?: boolean;
  isAdding: boolean;
  isFetching: boolean;
  liveDocumentIds?: Set<string>;
  onAddNew: () => void;
  onBlockedDocumentOpen: (document: DocumentRecord) => void;
  onDeleteDocument: (document: DocumentRecord) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Library
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Documents</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Open any document to continue its conversation.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            disabled={isAddDisabled}
            icon={<Plus className="h-4 w-4" />}
            isLoading={isAdding}
            onClick={onAddNew}
            size="sm"
            type="button"
          >
            Add new
          </Button>
          <Button
            icon={<RefreshCw className="h-4 w-4" />}
            isLoading={isFetching}
            onClick={onRefresh}
            size="sm"
            type="button"
            variant="secondary"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-y border-line py-3 text-sm text-muted">
        <span className="rounded-full border border-line bg-paper px-3 py-1 font-medium text-ink">
          {documents.length} {documents.length === 1 ? "document" : "documents"}
        </span>
        {isFetching && documents.length > 0 ? (
          <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium">
            Refreshing
          </span>
        ) : null}
      </div>

      {isFetching && documents.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DocumentSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!isFetching && documents.length === 0 ? (
        <div className="rounded-[1.35rem] border border-dashed border-line bg-paper p-10 text-center">
          <h3 className="text-lg font-semibold text-ink">No documents yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Add a document to start building your searchable workspace.
          </p>
          <Button
            className="mt-6"
            disabled={isAddDisabled}
            icon={<Plus className="h-4 w-4" />}
            isLoading={isAdding}
            onClick={onAddNew}
            type="button"
          >
            Add new
          </Button>
          {isAddDisabled && addDisabledMessage ? (
            <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-muted">
              {addDisabledMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      {documents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              document={document}
              isDeleting={deletingDocumentId === document.id}
              isLiveUpdating={liveDocumentIds?.has(document.id)}
              key={document.id}
              onBlockedOpen={onBlockedDocumentOpen}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
