"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import {
  addAssistantMessage,
  addUserMessage,
  streamDocumentAnswer,
} from "@/store/slices/documentChatSlice";
import type { ChatMessage } from "@/types/apiTypes";

const createMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ChatComposer({
  documentId,
  isStreaming,
}: {
  documentId: string;
  isStreaming: boolean;
}) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || isStreaming) {
      return;
    }

    const now = new Date().toISOString();
    const assistantMessageId = createMessageId();

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedQuery,
      createdAt: now,
      status: "complete",
    };

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: now,
      status: "streaming",
    };

    dispatch(addUserMessage({ documentId, message: userMessage }));
    dispatch(addAssistantMessage({ documentId, message: assistantMessage }));
    dispatch(
      streamDocumentAnswer({
        assistantMessageId,
        documentId,
        query: trimmedQuery,
      }),
    );
    setQuery("");
  };

  return (
    <form className="sticky bottom-0 bg-canvas px-0 pb-4 pt-3 sm:pb-6" onSubmit={handleSubmit}>
      <div className="flex items-end gap-2 rounded-2xl border border-line bg-paper p-2 shadow-[0_12px_40px_oklch(0.13_0.006_260_/_0.08)] focus-within:border-ink">
        <label className="sr-only" htmlFor="document-chat-input">
          Ask this document
        </label>
        <textarea
          className="max-h-48 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-ink outline-none placeholder:text-muted"
          id="document-chat-input"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ask anything about this document"
          rows={1}
          value={query}
        />
        <button
          aria-label="Send message"
          className={cn(
            "focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-inverse transition-colors",
            (!query.trim() || isStreaming) && "opacity-45",
          )}
          disabled={!query.trim() || isStreaming}
          type="submit"
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
