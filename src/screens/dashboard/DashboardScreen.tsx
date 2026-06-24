"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock, FileText, Plus, Tags } from "lucide-react";
import {
  useDeleteDocumentMutation,
  useListDocumentsQuery,
  useUploadDocumentMutation,
} from "@/api/documentApi";
import { Button } from "@/components/shared/Button";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAppSelector } from "@/store/hooks";
import type { DocumentRecord, UploadDocumentResponse } from "@/types/apiTypes";
import { DashboardShell } from "./components/DashboardShell";
import { DeleteDocumentDialog } from "./components/DeleteDocumentDialog";
import { DocumentLibrary } from "./components/DocumentLibrary";

const acceptedFileTypes = ".pdf,.docx,.png,.jpg,.jpeg,.md,.markdown,.txt";

export function DashboardScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [deleteDocument, { isLoading: isDeletingDocument }] =
    useDeleteDocumentMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const {
    data: fetchedDocuments = [],
    isFetching: isFetchingDocuments,
    refetch,
  } = useListDocumentsQuery(user?.id);
  const [localDocuments, setLocalDocuments] = useState<DocumentRecord[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentRecord | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");
  const [deletingDocumentId, setDeletingDocumentId] = useState<string>();
  const [uploadError, setUploadError] = useState("");

  const realDocuments = useMemo(() => {
    const localOnly = localDocuments.filter(
      (localDocument) =>
        !fetchedDocuments.some((document) => document.id === localDocument.id),
    );

    return [...localOnly, ...fetchedDocuments];
  }, [fetchedDocuments, localDocuments]);

  const dashboardStats = useMemo(() => {
    const readyDocuments = realDocuments.filter((document) => {
      const status = document.proccessingStatus || document.status || "";
      return ["ready", "completed", "success"].includes(status.toLowerCase());
    });
    const processingDocuments = realDocuments.filter((document) => {
      const status = document.proccessingStatus || document.status || "";
      return ["processing", "uploaded", "pending"].includes(status.toLowerCase());
    });
    const classifications = new Set(
      realDocuments
        .map((document) => document.classification?.trim())
        .filter(Boolean),
    );

    return [
      {
        icon: FileText,
        label: "Documents",
        value: String(realDocuments.length),
      },
      {
        icon: CheckCircle2,
        label: "Ready",
        value: String(readyDocuments.length),
      },
      {
        icon: Clock,
        label: "Processing",
        value: String(processingDocuments.length),
      },
      {
        icon: Tags,
        label: "Classes",
        value: String(classifications.size),
      },
    ];
  }, [realDocuments]);

  const addUploadedDocument = (document: UploadDocumentResponse, title: string) => {
    setLocalDocuments((currentDocuments) => [
      {
        id: document.documentId,
        title,
        classification: "unclassified",
        status: document.status,
        proccessingStatus: document.status,
        createdAt: new Date().toISOString(),
      },
      ...currentDocuments.filter((item) => item.id !== document.documentId),
    ]);
  };

  const handleAddNew = () => {
    fileInputRef.current?.click();
  };

  const handleRequestDelete = (document: DocumentRecord) => {
    setDeleteError("");
    setDocumentToDelete(document);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeletingDocument) {
      return;
    }

    setDeleteError("");
    setDocumentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) {
      return;
    }

    setDeleteError("");
    setDeletingDocumentId(documentToDelete.id);

    try {
      await deleteDocument(documentToDelete.id).unwrap();
      setLocalDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== documentToDelete.id),
      );
      setDocumentToDelete(null);
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(error, "Unable to delete this document."),
      );
    } finally {
      setDeletingDocumentId(undefined);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError("");

    try {
      const uploaded = await uploadDocument({
        file,
        title: file.name,
        userId: user?.id,
      }).unwrap();
      addUploadedDocument(uploaded, file.name);
    } catch (error) {
      setUploadError(getApiErrorMessage(error, "Unable to upload this document."));
    }
  };

  return (
    <DashboardShell
      subtitle="Upload a document, then ask for sourced answers."
      title="Document workspace"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">
            Document workspace
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Keep every document organized, then open one to ask focused
            questions.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            icon={<Plus className="h-4 w-4" />}
            isLoading={isUploading}
            onClick={handleAddNew}
            type="button"
          >
            Add new
          </Button>
        </div>
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div className="rounded-2xl border border-line bg-paper p-4" key={stat.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted">{stat.label}</p>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-canvas text-ink">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="min-w-0 space-y-6">
        <input
          accept={acceptedFileTypes}
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
        {uploadError ? (
          <StatusMessage tone="error">{uploadError}</StatusMessage>
        ) : null}
        <DocumentLibrary
          deletingDocumentId={deletingDocumentId}
          documents={realDocuments}
          isAdding={isUploading}
          isFetching={isFetchingDocuments}
          onAddNew={handleAddNew}
          onDeleteDocument={handleRequestDelete}
          onRefresh={refetch}
        />
      </div>
      <DeleteDocumentDialog
        document={documentToDelete}
        error={deleteError}
        isDeleting={isDeletingDocument}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </DashboardShell>
  );
}
