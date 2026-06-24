"use client";

import { FormEvent, useState } from "react";
import { Send, Search } from "lucide-react";
import { useSearchDocumentMutation } from "@/api/documentApi";
import { Button } from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Input";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { getApiErrorMessage } from "@/lib/apiError";
import { DashboardPanel } from "./DashboardPanel";

export function AskDocumentPanel({
  documentId,
  onDocumentIdChange,
}: {
  documentId: string;
  onDocumentIdChange: (value: string) => void;
}) {
  const [searchDocument, { isLoading }] = useSearchDocumentMutation();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnswer("");
    setNotice("");
    setError("");

    try {
      const response = await searchDocument({ documentId, query }).unwrap();
      if (response.status === "no_results") {
        setNotice("No indexed chunks were found for this document.");
        return;
      }
      setAnswer(response.answer);
    } catch (searchError) {
      setError(getApiErrorMessage(searchError, "Unable to search this document."));
    }
  };

  return (
    <DashboardPanel
      description="Send a question to /document/search and read the streamed answer."
      title="Ask a question"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Document ID"
          onChange={(event) => onDocumentIdChange(event.target.value)}
          placeholder="UUID returned by upload"
          required
          value={documentId}
        />
        <Textarea
          label="Question"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What does this document say about termination?"
          required
          value={query}
        />
        {notice ? <StatusMessage>{notice}</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <Button
          icon={<Send className="h-4 w-4" />}
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          Ask document
        </Button>
      </form>
      {answer ? (
        <div className="mt-6 rounded-md border border-line bg-canvas p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Search className="h-4 w-4" />
            Answer
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink">{answer}</p>
        </div>
      ) : null}
    </DashboardPanel>
  );
}
