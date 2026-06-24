import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/Button";
import type { DocumentRecord } from "@/types/apiTypes";
import { DocumentCard } from "./DocumentCard";

function DocumentSkeleton() {
  return (
    <div className="min-h-72 rounded-2xl border border-line bg-[oklch(0.992_0.003_260)] p-4">
      <div className="h-28 rounded-xl border border-line bg-canvas p-4">
        <div className="h-2.5 w-2/3 rounded-full bg-ink/12" />
        <div className="mt-4 space-y-2">
          <div className="h-2 rounded-full bg-ink/10" />
          <div className="h-2 w-10/12 rounded-full bg-ink/10" />
          <div className="h-2 w-7/12 rounded-full bg-ink/10" />
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-4 w-4/5 rounded-full bg-ink/15" />
        <div className="h-4 w-3/5 rounded-full bg-ink/10" />
      </div>
      <div className="mt-12 flex gap-2">
        <div className="h-7 w-24 rounded-full bg-ink/10" />
        <div className="h-7 w-20 rounded-full bg-ink/10" />
      </div>
    </div>
  );
}

export function DocumentLibrary({
  deletingDocumentId,
  documents,
  isAdding,
  isFetching,
  onAddNew,
  onDeleteDocument,
  onRefresh,
}: {
  deletingDocumentId?: string;
  documents: DocumentRecord[];
  isAdding: boolean;
  isFetching: boolean;
  onAddNew: () => void;
  onDeleteDocument: (document: DocumentRecord) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-ink">All documents</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Open a document card to ask questions in its dedicated chat.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
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

      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          {documents.length} {documents.length === 1 ? "document" : "documents"}
        </span>
      </div>

      {isFetching && documents.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DocumentSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!isFetching && documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-[oklch(0.992_0.003_260)] p-10 text-center">
          <h3 className="text-lg font-semibold text-ink">No documents yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Add a document to start building your searchable workspace.
          </p>
          <Button
            className="mt-6"
            icon={<Plus className="h-4 w-4" />}
            isLoading={isAdding}
            onClick={onAddNew}
            type="button"
          >
            Add new
          </Button>
        </div>
      ) : null}

      {documents.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              document={document}
              isDeleting={deletingDocumentId === document.id}
              key={document.id}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
