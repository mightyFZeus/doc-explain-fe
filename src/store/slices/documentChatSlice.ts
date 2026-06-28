import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { globalApi } from "@/api/globalApi";
import { API_BASE_URL, DOCUMENT_ENDPOINTS } from "@/constants/endpoints";
import { TRIAL_LIMIT_MESSAGE } from "@/lib/apiError";
import type { RootState } from "@/store/store";
import type { ChatMessage } from "@/types/apiTypes";

interface DocumentChatState {
  messagesByDocumentId: Record<string, ChatMessage[]>;
  loadingByDocumentId: Record<string, boolean>;
}

const initialState: DocumentChatState = {
  messagesByDocumentId: {},
  loadingByDocumentId: {},
};

const readError = async (response: Response) => {
  try {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.error ?? body.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
};

export const streamDocumentAnswer = createAsyncThunk<
  void,
  {
    assistantMessageId: string;
    documentId: string;
    query: string;
  }
>(
  "documentChat/streamDocumentAnswer",
  async (
    { assistantMessageId, documentId, query },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        throw new Error("Please log in again before searching this document.");
      }

      const response = await fetch(`${API_BASE_URL}${DOCUMENT_ENDPOINTS.search}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId, query }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(TRIAL_LIMIT_MESSAGE);
        }

        throw new Error(await readError(response));
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = (await response.json()) as {
          data?: { status?: string };
        };
        if (body.data?.status === "no_results") {
          dispatch(
            completeAssistantMessage({
              documentId,
              messageId: assistantMessageId,
              content: "No indexed chunks were found for this document.",
            }),
          );
          dispatch(
            globalApi.util.invalidateTags([
              { type: "Conversation", id: documentId },
            ]),
          );
          return;
        }
      }

      const reader = response.body?.getReader();
      if (!reader) {
        dispatch(
          completeAssistantMessage({
            documentId,
            messageId: assistantMessageId,
          }),
        );
        dispatch(
          globalApi.util.invalidateTags([{ type: "Conversation", id: documentId }]),
        );
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .find((line) => line.trim().startsWith("data:"));

          if (!dataLine) {
            continue;
          }

          const rawData = dataLine.replace(/^data:\s*/, "");
          const parsed = JSON.parse(rawData) as {
            content?: string;
            done?: boolean;
            error?: string;
          };

          if (parsed.error) {
            throw new Error(parsed.error);
          }

          if (parsed.content) {
            dispatch(
              appendAssistantMessageChunk({
                chunk: parsed.content,
                documentId,
                messageId: assistantMessageId,
              }),
            );
          }

          if (parsed.done) {
            done = true;
          }
        }
      }

      dispatch(
        completeAssistantMessage({
          documentId,
          messageId: assistantMessageId,
        }),
      );
      dispatch(
        globalApi.util.invalidateTags([{ type: "Conversation", id: documentId }]),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to search this document.";
      dispatch(
        failAssistantMessage({
          content: message,
          documentId,
          messageId: assistantMessageId,
        }),
      );
      return rejectWithValue(message);
    }
  },
);

const documentChatSlice = createSlice({
  name: "documentChat",
  initialState,
  reducers: {
    addAssistantMessage: (
      state,
      action: PayloadAction<{ documentId: string; message: ChatMessage }>,
    ) => {
      state.messagesByDocumentId[action.payload.documentId] = [
        ...(state.messagesByDocumentId[action.payload.documentId] ?? []),
        action.payload.message,
      ];
    },
    addUserMessage: (
      state,
      action: PayloadAction<{ documentId: string; message: ChatMessage }>,
    ) => {
      state.messagesByDocumentId[action.payload.documentId] = [
        ...(state.messagesByDocumentId[action.payload.documentId] ?? []),
        action.payload.message,
      ];
    },
    appendAssistantMessageChunk: (
      state,
      action: PayloadAction<{
        chunk: string;
        documentId: string;
        messageId: string;
      }>,
    ) => {
      const messages = state.messagesByDocumentId[action.payload.documentId] ?? [];
      const message = messages.find((item) => item.id === action.payload.messageId);
      if (message) {
        message.content += action.payload.chunk;
      }
    },
    clearDocumentChat: (state, action: PayloadAction<string>) => {
      state.messagesByDocumentId[action.payload] = [];
    },
    hydrateDocumentConversation: (
      state,
      action: PayloadAction<{
        documentId: string;
        messages: ChatMessage[];
      }>,
    ) => {
      state.messagesByDocumentId[action.payload.documentId] =
        action.payload.messages;
    },
    retryAssistantMessage: (
      state,
      action: PayloadAction<{ documentId: string; messageId: string }>,
    ) => {
      const messages = state.messagesByDocumentId[action.payload.documentId] ?? [];
      const message = messages.find((item) => item.id === action.payload.messageId);
      if (message) {
        message.content = "";
        message.status = "streaming";
      }
    },
    completeAssistantMessage: (
      state,
      action: PayloadAction<{
        content?: string;
        documentId: string;
        messageId: string;
      }>,
    ) => {
      const messages = state.messagesByDocumentId[action.payload.documentId] ?? [];
      const message = messages.find((item) => item.id === action.payload.messageId);
      if (message) {
        if (action.payload.content) {
          message.content = action.payload.content;
        }
        message.status = "complete";
      }
    },
    failAssistantMessage: (
      state,
      action: PayloadAction<{
        content: string;
        documentId: string;
        messageId: string;
      }>,
    ) => {
      const messages = state.messagesByDocumentId[action.payload.documentId] ?? [];
      const message = messages.find((item) => item.id === action.payload.messageId);
      if (message) {
        message.content = action.payload.content;
        message.status = "error";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(streamDocumentAnswer.pending, (state, action) => {
        state.loadingByDocumentId[action.meta.arg.documentId] = true;
      })
      .addCase(streamDocumentAnswer.fulfilled, (state, action) => {
        state.loadingByDocumentId[action.meta.arg.documentId] = false;
      })
      .addCase(streamDocumentAnswer.rejected, (state, action) => {
        state.loadingByDocumentId[action.meta.arg.documentId] = false;
      });
  },
});

export const {
  addAssistantMessage,
  addUserMessage,
  appendAssistantMessageChunk,
  clearDocumentChat,
  completeAssistantMessage,
  failAssistantMessage,
  hydrateDocumentConversation,
  retryAssistantMessage,
} = documentChatSlice.actions;

export default documentChatSlice.reducer;
