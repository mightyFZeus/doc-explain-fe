"use client";

import { FormEvent, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useUploadDocumentMutation } from "@/api/documentApi";
import { Button } from "@/components/shared/Button";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UploadDocumentResponse } from "@/types/apiTypes";
import { DashboardPanel } from "./DashboardPanel";

const acceptedFileTypes = ".pdf,.docx,.png,.jpg,.jpeg,.md,.markdown,.txt";

export function UploadDocumentPanel({
  defaultUserId,
  onCancel,
  onUploaded,
}: {
  defaultUserId?: string;
  onCancel?: () => void;
  onUploaded: (document: UploadDocumentResponse, title: string) => void;
}) {
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Choose a document first.");
      return;
    }

    try {
      const uploaded = await uploadDocument({
        file,
        title: file.name,
        userId: defaultUserId,
      }).unwrap();
      onUploaded(uploaded, file.name);
      setMessage(`Uploaded ${uploaded.documentId}`);
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError, "Unable to upload this document."));
    }
  };

  return (
    <DashboardPanel
      description="Send a supported file to /document/upload."
      title="Add document"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">Document</span>
          <input
            accept={acceptedFileTypes}
            className="focus-ring block w-full rounded-md border border-dashed border-line bg-canvas px-4 py-5 text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-inverse hover:border-ink/40"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            icon={<UploadCloud className="h-4 w-4" />}
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Upload document
          </Button>
          {onCancel ? (
            <Button
              className="w-full sm:w-auto"
              icon={<X className="h-4 w-4" />}
              onClick={onCancel}
              size="lg"
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </DashboardPanel>
  );
}
