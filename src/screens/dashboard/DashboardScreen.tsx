"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { CheckCircle2, Clock, FileText, Plus, Tags } from "lucide-react";
import {
  documentApi,
  registerUploadProgressHandler,
  useDeleteDocumentMutation,
  useListDocumentsQuery,
  useUploadDocumentMutation,
} from "@/api/documentApi";
import { Button } from "@/components/shared/Button";
import { StatusMessage } from "@/components/shared/StatusMessage";
import {
  getApiErrorMessage,
  isForbiddenApiError,
  TRIAL_LIMIT_MESSAGE,
} from "@/lib/apiError";
import {
  applyDocumentStatusEvent,
  getDocumentStatus,
  isDocumentProcessingStatus,
  isDocumentReadyStatus,
} from "@/lib/documentStatus";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { recordGuestDocumentUpload } from "@/store/slices/authSlice";
import type {
  DocumentRecord,
  DocumentStatusEvent,
  UploadDocumentProgress,
  UploadDocumentResponse,
} from "@/types/apiTypes";
import { DashboardStatCard } from "./components/DashboardStatCard";
import { DashboardShell } from "./components/DashboardShell";
import {
  DashboardToast,
  type DashboardToastMessage,
  type DashboardToastTone,
} from "./components/DashboardToast";
import { DeleteDocumentDialog } from "./components/DeleteDocumentDialog";
import { DocumentLibrary } from "./components/DocumentLibrary";
import { useDocumentStatusSocket } from "./hooks/useDocumentStatusSocket";

const acceptedFileTypes = ".pdf,.docx,.png,.jpg,.jpeg,.md,.markdown,.txt";

const createUploadProgressKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

type ActiveUploadProgress = UploadDocumentProgress & {
  fileName: string;
};

const formatTrialExpiry = (date?: string | null) => {
  if (!date) {
    return "24 hours";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(new Date(date));
};

function GuestTrialNotice({
  documentsUsed,
  expiresAt,
  maxDocuments,
}: {
  documentsUsed: number;
  expiresAt?: string | null;
  maxDocuments: number;
}) {
  return (
    <div className="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-line bg-paper px-4 py-2 text-xs font-medium text-muted">
      <span className="font-semibold text-ink">Guest trial</span>
      <span>
        {documentsUsed}/{maxDocuments} document used
      </span>
      <span>Expires {formatTrialExpiry(expiresAt)}</span>
    </div>
  );
}

function UploadProgressNotice({
  progress,
}: {
  progress: ActiveUploadProgress;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)]">
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="min-w-0">
          <p className="font-semibold text-ink">Uploading document</p>
          <p className="mt-1 truncate text-xs text-muted">{progress.fileName}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-ink">
          {progress.percent}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-200"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { expiresAt, limits, token, trialUsage, user } = useAppSelector(
    (state) => state.auth,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [deleteDocument, { isLoading: isDeletingDocument }] =
    useDeleteDocumentMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const {
    data: fetchedDocuments = [],
    isFetching: isFetchingDocuments,
    refetch,
  } = useListDocumentsQuery(user && token ? user.id : skipToken);
  const [localDocuments, setLocalDocuments] = useState<DocumentRecord[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentRecord | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");
  const [deletingDocumentId, setDeletingDocumentId] = useState<string>();
  const [toast, setToast] = useState<DashboardToastMessage | null>(null);
  const [uploadProgress, setUploadProgress] =
    useState<ActiveUploadProgress | null>(null);
  const [uploadError, setUploadError] = useState("");

  const showToast = useCallback(
    (message: string, tone: DashboardToastTone = "info") => {
      setToast({
        id: Date.now(),
        message,
        tone,
      });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === toast.id ? null : currentToast,
      );
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const realDocuments = useMemo(() => {
    const localOnly = localDocuments.filter(
      (localDocument) =>
        !fetchedDocuments.some((document) => document.id === localDocument.id),
    );

    return [...localOnly, ...fetchedDocuments];
  }, [fetchedDocuments, localDocuments]);
  const isGuestTrial = user?.accountType === "guest";
  const maxGuestDocuments = limits?.documents ?? 1;
  const guestDocumentsUsed = Math.max(
    trialUsage?.documents ?? 0,
    realDocuments.length,
  );
  const hasReachedGuestDocumentLimit =
    isGuestTrial && guestDocumentsUsed >= maxGuestDocuments;
  const guestDocumentLimitMessage =
    "Guest trial includes 1 document. Sign up or log in to continue.";

  const dashboardStats = useMemo(() => {
    const totalDocuments = realDocuments.length;
    const readyDocuments = realDocuments.filter((document) => {
      const status = getDocumentStatus(document);
      return isDocumentReadyStatus(status);
    });
    const processingDocuments = realDocuments.filter((document) => {
      const status = getDocumentStatus(document);
      return isDocumentProcessingStatus(status);
    });
    const classifications = new Set(
      realDocuments
        .map((document) => document.classification?.trim())
        .filter(Boolean),
    );
    const percentOfTotal = (count: number) => {
      if (!totalDocuments || !count) {
        return "0%";
      }

      return `${Math.max(8, Math.round((count / totalDocuments) * 100))}%`;
    };

    return [
      {
        description: "Stored in your workspace",
        icon: FileText,
        label: "Documents",
        progress: totalDocuments ? "100%" : "0%",
        value: String(totalDocuments),
      },
      {
        description: "Ready for document chat",
        icon: CheckCircle2,
        label: "Ready",
        progress: percentOfTotal(readyDocuments.length),
        value: String(readyDocuments.length),
      },
      {
        description: "Still being indexed",
        icon: Clock,
        label: "Processing",
        progress: percentOfTotal(processingDocuments.length),
        value: String(processingDocuments.length),
      },
      {
        description: "Unique document classes",
        icon: Tags,
        label: "Classes",
        progress: percentOfTotal(classifications.size),
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

  const handleDocumentStatusEvent = useCallback(
    (event: DocumentStatusEvent) => {
      const nextStatus =
        event.processingStatus ?? event.proccessingStatus ?? event.status ?? "";

      setLocalDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          applyDocumentStatusEvent(document, event),
        ),
      );

      dispatch(
        documentApi.util.updateQueryData("listDocuments", user?.id, (draft) => {
          const document = draft.find((item) => item.id === event.documentId);

          if (document) {
            Object.assign(document, applyDocumentStatusEvent(document, event));
          }
        }),
      );

      if (nextStatus && isDocumentReadyStatus(nextStatus)) {
        showToast("Document is ready to chat.", "success");
      }
    },
    [dispatch, showToast, user?.id],
  );

  const { liveDocumentIds } = useDocumentStatusSocket({
    authToken: token,
    documents: realDocuments,
    onStatusEvent: handleDocumentStatusEvent,
  });

  const handleAddNew = () => {
    if (hasReachedGuestDocumentLimit) {
      showToast(guestDocumentLimitMessage);
      return;
    }

    fileInputRef.current?.click();
  };

  const handleRequestDelete = (document: DocumentRecord) => {
    setDeleteError("");
    setDocumentToDelete(document);
  };

  const handleBlockedDocumentOpen = () => {
    showToast("This document is still processing.");
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

    if (hasReachedGuestDocumentLimit) {
      setUploadError(guestDocumentLimitMessage);
      showToast(guestDocumentLimitMessage);
      return;
    }

    setUploadError("");
    const progressKey = createUploadProgressKey();
    const unregisterProgressHandler = registerUploadProgressHandler(
      progressKey,
      (progress) =>
        setUploadProgress({
          ...progress,
          fileName: file.name,
        }),
    );

    setUploadProgress({
      fileName: file.name,
      loaded: 0,
      percent: 0,
      total: file.size,
    });

    try {
      const uploaded = await uploadDocument({
        file,
        progressKey,
        title: file.name,
        userId: user?.id,
      }).unwrap();
      addUploadedDocument(uploaded, file.name);
      dispatch(recordGuestDocumentUpload());
      window.setTimeout(() => setUploadProgress(null), 800);
    } catch (error) {
      setUploadProgress(null);
      setUploadError(
        isForbiddenApiError(error)
          ? TRIAL_LIMIT_MESSAGE
          : getApiErrorMessage(error, "Unable to upload this document."),
      );
    } finally {
      unregisterProgressHandler();
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
          {isGuestTrial ? (
            <GuestTrialNotice
              documentsUsed={guestDocumentsUsed}
              expiresAt={expiresAt ?? user?.guestExpiresAt}
              maxDocuments={maxGuestDocuments}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            icon={<Plus className="h-4 w-4" />}
            disabled={hasReachedGuestDocumentLimit}
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
          <DashboardStatCard key={stat.label} {...stat} />
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
        {uploadProgress ? (
          <UploadProgressNotice progress={uploadProgress} />
        ) : null}
        <DocumentLibrary
          deletingDocumentId={deletingDocumentId}
          documents={realDocuments}
          isAdding={isUploading}
          isFetching={isFetchingDocuments}
          liveDocumentIds={liveDocumentIds}
          isAddDisabled={hasReachedGuestDocumentLimit}
          addDisabledMessage={guestDocumentLimitMessage}
          onAddNew={handleAddNew}
          onBlockedDocumentOpen={handleBlockedDocumentOpen}
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
      <DashboardToast toast={toast} />
    </DashboardShell>
  );
}
