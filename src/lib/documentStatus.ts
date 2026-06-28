import type { DocumentRecord, DocumentStatusEvent } from "@/types/apiTypes";

const readyStatuses = new Set(["ready", "completed", "success"]);
const processingStatuses = new Set(["processing", "uploaded", "pending", "indexing"]);
const failedStatuses = new Set(["failed", "error"]);

export function getDocumentStatus(document: DocumentRecord) {
  return (
    document.processingStatus ||
    document.proccessingStatus ||
    document.status ||
    "uploaded"
  );
}

export function getDocumentStatusLabel(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function isDocumentReadyStatus(status: string) {
  return readyStatuses.has(status.toLowerCase());
}

export function isDocumentProcessingStatus(status: string) {
  return processingStatuses.has(status.toLowerCase());
}

export function isDocumentFailedStatus(status: string) {
  return failedStatuses.has(status.toLowerCase());
}

export function isDocumentProcessing(document: DocumentRecord) {
  return isDocumentProcessingStatus(getDocumentStatus(document));
}

export function applyDocumentStatusEvent(
  document: DocumentRecord,
  event: DocumentStatusEvent,
) {
  if (document.id !== event.documentId) {
    return document;
  }

  const nextProcessingStatus =
    event.processingStatus ?? event.proccessingStatus ?? document.processingStatus;

  return {
    ...document,
    status: event.status ?? document.status,
    processingStatus: nextProcessingStatus,
    proccessingStatus: nextProcessingStatus ?? document.proccessingStatus,
    chunkCount: event.chunkCount ?? document.chunkCount,
    updatedAt: event.updatedAt ?? document.updatedAt,
  };
}
