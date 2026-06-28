"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { ArrowLeft, Info } from "lucide-react";
import {
  useGetDocumentConversationsQuery,
  useListDocumentsQuery,
} from "@/api/documentApi";
import { Button } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addAssistantMessage,
  addUserMessage,
  hydrateDocumentConversation,
  retryAssistantMessage,
  streamDocumentAnswer,
} from "@/store/slices/documentChatSlice";
import { recordGuestQuestion } from "@/store/slices/authSlice";
import type { ChatMessage, DocumentConversationMessage } from "@/types/apiTypes";
import { DashboardShell } from "../components/DashboardShell";
import { ChatComposer } from "./components/ChatComposer";
import { ChatMessageList } from "./components/ChatMessageList";
import { DocumentInfoDrawer } from "./components/DocumentInfoDrawer";

const suggestedQuestions = [
  "Summarize this document",
  "What are the key risks?",
  "What dates or obligations are mentioned?",
];

const createMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function GuestQuestionNotice({
  remainingQuestions,
}: {
  remainingQuestions: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-2 text-xs font-medium text-muted">
      <span className="font-semibold text-ink">Guest trial</span>
      <span className="mx-2 h-1 w-1 rounded-full bg-muted/45" />
      <span>
        {Math.max(0, remainingQuestions)}{" "}
        {remainingQuestions === 1 ? "question" : "questions"} left
      </span>
    </div>
  );
}

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
  const { limits, token, trialUsage, user } = useAppSelector((state) => state.auth);
  const userId = user?.id;
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const messages =
    useAppSelector(
      (state) => state.documentChat.messagesByDocumentId[documentId],
    ) ?? [];
  const isStreaming =
    useAppSelector(
      (state) => state.documentChat.loadingByDocumentId[documentId],
    ) ?? false;
  const { data: documents = [] } = useListDocumentsQuery(
    userId && token ? userId : skipToken,
  );
  const {
    data: conversations = [],
    isFetching: isFetchingConversations,
  } = useGetDocumentConversationsQuery(token ? documentId : skipToken);
  const activeDocument = documents.find((document) => document.id === documentId);
  const activeConversation = conversations[0];
  const documentTitle =
    activeDocument?.title?.trim() ||
    activeDocument?.originalFilename?.trim() ||
    "Document";
  const isGuestTrial = user?.accountType === "guest";
  const maxGuestQuestions = limits?.questions ?? 5;
  const questionsUsed = messages.filter((message) => message.role === "user").length;
  const guestQuestionsUsed = Math.max(trialUsage?.questions ?? 0, questionsUsed);
  const remainingGuestQuestions = maxGuestQuestions - guestQuestionsUsed;
  const hasReachedGuestQuestionLimit =
    isGuestTrial && guestQuestionsUsed >= maxGuestQuestions;
  const isCheckingGuestQuestionLimit =
    isGuestTrial && isFetchingConversations && messages.length === 0;
  const isQuestionInputDisabled =
    hasReachedGuestQuestionLimit || isCheckingGuestQuestionLimit;
  const questionDisabledReason = hasReachedGuestQuestionLimit
    ? "Question limit reached"
    : isCheckingGuestQuestionLimit
      ? "Checking guest trial"
      : undefined;
  const guestQuestionLimitMessage =
    "Guest trial includes 5 questions. Sign up or log in to continue.";
  const [trialLimitNotice, setTrialLimitNotice] = useState("");

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
    if (isStreaming || isCheckingGuestQuestionLimit) {
      return;
    }

    if (hasReachedGuestQuestionLimit) {
      setTrialLimitNotice(guestQuestionLimitMessage);
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
    dispatch(recordGuestQuestion());
  };

  const handleSendQuestion = useCallback(
    (query: string) => {
      if (isStreaming || isCheckingGuestQuestionLimit) {
        return;
      }

      if (hasReachedGuestQuestionLimit) {
        setTrialLimitNotice(guestQuestionLimitMessage);
        return;
      }

      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        return;
      }

      setTrialLimitNotice("");
      const now = new Date().toISOString();
      const assistantMessageId = createMessageId();

      dispatch(
        addUserMessage({
          documentId,
          message: {
            id: createMessageId(),
            role: "user",
            content: trimmedQuery,
            createdAt: now,
            status: "complete",
          },
        }),
      );
      dispatch(
        addAssistantMessage({
          documentId,
          message: {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            createdAt: now,
            status: "streaming",
          },
        }),
      );
      dispatch(
        streamDocumentAnswer({
          assistantMessageId,
          documentId,
          query: trimmedQuery,
        }),
      );
      dispatch(recordGuestQuestion());
    },
    [
      dispatch,
      documentId,
      guestQuestionLimitMessage,
      hasReachedGuestQuestionLimit,
      isCheckingGuestQuestionLimit,
      isStreaming,
    ],
  );

  return (
    <DashboardShell
      subtitle="Ask questions against this document only."
      title="Document chat"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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
        <div className="flex flex-wrap items-center gap-2">
          {isGuestTrial ? (
            <GuestQuestionNotice remainingQuestions={remainingGuestQuestions} />
          ) : null}
          <Button
            icon={<Info className="h-4 w-4" />}
            onClick={() => setIsInfoDrawerOpen(true)}
            type="button"
            variant="secondary"
          >
            Info
          </Button>
        </div>
      </div>
      {trialLimitNotice ? (
        <div className="mb-4 rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
          {trialLimitNotice}
        </div>
      ) : null}

      <div className="mx-auto flex min-h-[calc(100vh-13rem)] max-w-4xl flex-col">
        <ChatMessageList
          isLoadingHistory={isFetchingConversations && messages.length === 0}
          isRetryDisabled={isStreaming || isQuestionInputDisabled}
          isSuggestionDisabled={isStreaming || isQuestionInputDisabled}
          isStreaming={isStreaming}
          messages={messages}
          onRetryMessage={handleRetryMessage}
          onSuggestedQuestion={handleSendQuestion}
          suggestedQuestions={suggestedQuestions}
        />
        <ChatComposer
          disabledReason={questionDisabledReason}
          isDisabled={isQuestionInputDisabled}
          isStreaming={isStreaming}
          onSendMessage={handleSendQuestion}
        />
      </div>
      <DocumentInfoDrawer
        document={activeDocument}
        isOpen={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
      />
    </DashboardShell>
  );
}
