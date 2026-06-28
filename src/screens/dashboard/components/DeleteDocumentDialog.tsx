"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import type { DocumentRecord } from "@/types/apiTypes";

const getDocumentTitle = (document: DocumentRecord) =>
  document.title || document.originalFilename || "Untitled document";

export function DeleteDocumentDialog({
  document,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: {
  document: DocumentRecord | null;
  error?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const title = document ? getDocumentTitle(document) : "";

  useEffect(() => {
    if (!document) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [document, isDeleting, onClose]);

  if (!document) {
    return null;
  }

  return (
    <div
      aria-labelledby="delete-document-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_80px_oklch(0.13_0.006_260_/_0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-line bg-canvas text-ink">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            aria-label="Close delete confirmation"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
            disabled={isDeleting}
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2
          className="mt-5 text-xl font-semibold leading-7 text-ink"
          id="delete-document-title"
        >
          Delete this document?
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          This removes{" "}
          <span className="font-medium text-ink" title={title}>
            {title}
          </span>{" "}
          from your workspace. You will need to upload it again to ask questions
          about it.
        </p>

        {error ? (
          <p className="mt-4 rounded-md border border-danger-line bg-danger-surface px-3 py-2 text-sm leading-6 text-danger">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            disabled={isDeleting}
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button isLoading={isDeleting} onClick={onConfirm} type="button">
            Delete document
          </Button>
        </div>
      </div>
    </div>
  );
}
