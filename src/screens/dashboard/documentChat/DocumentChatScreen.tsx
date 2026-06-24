"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  useGetDocumentConversationsQuery,
  useListDocumentsQuery,
} from "@/api/documentApi";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateDocumentConversation,
  retryAssistantMessage,
  streamDocumentAnswer,
} from "@/store/slices/documentChatSlice";
import type { ChatMessage, DocumentConversationMessage } from "@/types/apiTypes";
import { DashboardShell } from "../components/DashboardShell";
import { ChatComposer } from "./components/ChatComposer";
import { ChatMessageList } from "./components/ChatMessageList";

const mapConversationMessage = (
  message: DocumentConversationMessage,
): ChatMessage => ({
  id: message.id,
  role: message.role === "assistant" ? "assistant" : "user",
  content: message.content,
  createdAt: message.createdAt,
  status: "complete",
});

export function DocumentChatScreen({ documentId }: { documentId: string }) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const messages =
    useAppSelector(
      (state) => state.documentChat.messagesByDocumentId[documentId],
    ) ?? [];
  const isStreaming =
    useAppSelector(
      (state) => state.documentChat.loadingByDocumentId[documentId],
    ) ?? false;
  const { data: documents = [] } = useListDocumentsQuery(userId);
  const {
    data: conversations = [],
    isFetching: isFetchingConversations,
  } = useGetDocumentConversationsQuery(documentId);
  const activeDocument = documents.find((document) => document.id === documentId);
  const activeConversation = conversations[0];
  const documentTitle =
    activeDocument?.title?.trim() ||
    activeDocument?.originalFilename?.trim() ||
    "Document";

  useEffect(() => {
    if (!activeConversation || isStreaming) {
      return;
    }

    const historyMessages =
      activeConversation.messages?.map(mapConversationMessage) ?? [];

    if (messages.length > historyMessages.length) {
      return;
    }

    dispatch(
      hydrateDocumentConversation({
        documentId,
        messages: historyMessages,
      }),
    );
  }, [activeConversation, dispatch, documentId, isStreaming, messages.length]);

  const handleRetryMessage = (messageId: string) => {
    if (isStreaming) {
      return;
    }

    const failedMessageIndex = messages.findIndex(
      (message) => message.id === messageId,
    );
    if (failedMessageIndex <= 0) {
      return;
    }

    const previousUserMessage = messages
      .slice(0, failedMessageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUserMessage) {
      return;
    }

    dispatch(retryAssistantMessage({ documentId, messageId }));
    dispatch(
      streamDocumentAnswer({
        assistantMessageId: messageId,
        documentId,
        query: previousUserMessage.content,
      }),
    );
  };

  return (
    <DashboardShell
      subtitle="Ask questions against this document only."
      title="Document chat"
    >
      <div className="mb-6">
        <div className="min-w-0">
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition-colors hover:text-ink"
            href={ROUTES.dashboard}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to documents
          </Link>
          <div className="mt-4 min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Document
            </p>
            <h1
              className="mt-1 max-w-full truncate text-3xl font-semibold leading-tight text-ink sm:max-w-[52rem] sm:text-4xl"
              title={documentTitle}
            >
              {documentTitle}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-13rem)] max-w-4xl flex-col">
        <ChatMessageList
          isLoadingHistory={isFetchingConversations && messages.length === 0}
          isStreaming={isStreaming}
          messages={messages}
          onRetryMessage={handleRetryMessage}
        />
        <ChatComposer
          documentId={documentId}
          isStreaming={isStreaming}
        />
      </div>
    </DashboardShell>
  );
}
