"use client";

import { useState } from "react";
import { Check, Copy, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/apiTypes";

export function ChatMessageBubble({
  isRetryDisabled,
  message,
  onRetry,
}: {
  isRetryDisabled?: boolean;
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}) {
  const [hasCopied, setHasCopied] = useState(false);
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming" && !message.content;
  const canCopy =
    !isUser && message.status !== "error" && message.status !== "streaming" && message.content;
  const canRetry = !isUser && message.status === "error" && onRetry;

  const handleCopy = async () => {
    if (!canCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(message.content);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 1500);
    } catch {
      setHasCopied(false);
    }
  };

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <article
        className={cn(
          "max-w-[min(100%,42rem)] px-4 py-3 text-sm leading-7",
          isUser
            ? "rounded-2xl bg-ink text-inverse"
            : "text-ink",
          message.status === "error"
            ? "rounded-lg border border-danger-line bg-danger-surface text-danger"
            : "",
        )}
      >
        {isStreaming ? (
          <span className="inline-flex items-center gap-2 text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching document
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        {!isUser && !isStreaming ? (
          <div className="mt-3 flex items-center gap-1">
            {canCopy ? (
              <button
                aria-label={hasCopied ? "Response copied" : "Copy response"}
                className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:text-ink"
                onClick={handleCopy}
                title={hasCopied ? "Copied" : "Copy response"}
                type="button"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            ) : null}
            {canRetry ? (
              <button
                aria-label="Retry response"
                className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-transparent text-danger transition-colors hover:border-danger-line hover:bg-paper disabled:opacity-45"
                disabled={isRetryDisabled}
                onClick={() => onRetry(message.id)}
                title="Retry response"
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}
