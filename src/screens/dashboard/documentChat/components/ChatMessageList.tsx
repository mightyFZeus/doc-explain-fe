"use client";

import { useEffect, useRef } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import type { ChatMessage } from "@/types/apiTypes";
import { ChatMessageBubble } from "./ChatMessageBubble";

export function ChatMessageList({
  isLoadingHistory,
  isStreaming,
  messages,
  onRetryMessage,
}: {
  isLoadingHistory?: boolean;
  isStreaming: boolean;
  messages: ChatMessage[];
  onRetryMessage?: (messageId: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-0 py-6">
      {isLoadingHistory ? (
        <div className="m-auto inline-flex items-center gap-2 text-sm font-medium text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading conversation
        </div>
      ) : messages.length === 0 ? (
        <div className="m-auto max-w-sm text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-line bg-paper">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-ink">
            Start with a precise question
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Responses stay scoped to the uploaded document and cite chunks when
            the backend returns them.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessageBubble
            isRetryDisabled={isStreaming}
            key={message.id}
            message={message}
            onRetry={onRetryMessage}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
