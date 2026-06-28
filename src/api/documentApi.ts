import { API_BASE_URL, DOCUMENT_ENDPOINTS } from "@/constants/endpoints";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {
  ApiEnvelope,
  DeleteDocumentResponse,
  DocumentConversationRecord,
  DocumentConversationsResponse,
  DocumentRecord,
  SearchDocumentPayload,
  SearchDocumentResponse,
  UploadDocumentPayload,
  UploadDocumentResponse,
} from "@/types/apiTypes";
import { globalApi } from "./globalApi";
import type { RootState } from "@/store/store";

const readResponseError = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return response.statusText;
  }
};

const readSearchStream = async (
  response: Response,
): Promise<SearchDocumentResponse> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await response.json()) as ApiEnvelope<{ status?: string }>;
    if (json.data?.status === "no_results") {
      return {
        answer: "",
        done: true,
        status: "no_results",
      };
    }
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return {
      answer: "",
      done: true,
      status: "answered",
    };
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
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
        answer += parsed.content;
      }

      if (parsed.done) {
        done = true;
      }
    }
  }

  return {
    answer,
    done: true,
    status: "answered",
  };
};

type ListDocumentsResponse =
  | ApiEnvelope<DocumentRecord[]>
  | ApiEnvelope<{ documents: DocumentRecord[] }>
  | DocumentRecord[]
  | { documents: DocumentRecord[] };

type DocumentConversationsApiResponse =
  | ApiEnvelope<DocumentConversationsResponse>
  | DocumentConversationsResponse
  | DocumentConversationRecord[]
  | { conversations: DocumentConversationRecord[] };

type UploadDocumentApiResponse =
  | ApiEnvelope<UploadDocumentResponse>
  | UploadDocumentResponse;

const normalizeDocumentsResponse = (
  response: ListDocumentsResponse,
): DocumentRecord[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if ("documents" in response && Array.isArray(response.documents)) {
    return response.documents;
  }

  if ("data" in response) {
    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      "documents" in response.data &&
      Array.isArray(response.data.documents)
    ) {
      return response.data.documents;
    }
  }

  return [];
};

const normalizeDocumentConversationsResponse = (
  response: DocumentConversationsApiResponse,
): DocumentConversationRecord[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if ("conversations" in response && Array.isArray(response.conversations)) {
    return response.conversations;
  }

  if (
    "data" in response &&
    response.data &&
    typeof response.data === "object" &&
    "conversations" in response.data &&
    Array.isArray(response.data.conversations)
  ) {
    return response.data.conversations;
  }

  return [];
};

const normalizeUploadDocumentResponse = (
  response: UploadDocumentApiResponse,
): UploadDocumentResponse => ("data" in response ? response.data : response);

const uploadProgressHandlers = new Map<
  string,
  (progress: { loaded: number; percent: number; total: number }) => void
>();

export function registerUploadProgressHandler(
  progressKey: string,
  handler: (progress: { loaded: number; percent: number; total: number }) => void,
) {
  uploadProgressHandlers.set(progressKey, handler);

  return () => {
    uploadProgressHandlers.delete(progressKey);
  };
}

const emitUploadProgress = (
  progressKey: string | undefined,
  progress: { loaded: number; percent: number; total: number },
) => {
  if (!progressKey) {
    return;
  }

  uploadProgressHandlers.get(progressKey)?.(progress);
};

type UploadDocumentRequestError = FetchBaseQueryError;

const isUploadDocumentRequestError = (
  error: unknown,
): error is UploadDocumentRequestError =>
  Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      (typeof (error as { status?: unknown }).status === "number" ||
        typeof (error as { status?: unknown }).status === "string"),
  );

const uploadDocumentWithProgress = (
  url: string,
  payload: UploadDocumentPayload,
  token: string | null,
  signal: AbortSignal,
) =>
  new Promise<UploadDocumentResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append("document", payload.file);

    if (payload.title) {
      body.append("title", payload.title);
    }

    if (payload.userId) {
      body.append("userId", payload.userId);
    }

    xhr.open("POST", url);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      emitUploadProgress(payload.progressKey, {
        loaded: event.loaded,
        percent: Math.min(99, Math.round((event.loaded / event.total) * 100)),
        total: event.total,
      });
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText || "{}") as
          | UploadDocumentApiResponse
          | { error?: string; message?: string };

        if (xhr.status < 200 || xhr.status >= 300) {
          reject({
            data: response,
            status: xhr.status,
          });
          return;
        }

        emitUploadProgress(payload.progressKey, {
          loaded: payload.file.size,
          percent: 100,
          total: payload.file.size,
        });
        resolve(normalizeUploadDocumentResponse(response as UploadDocumentApiResponse));
      } catch {
        reject(xhr.statusText || "Unable to upload this document.");
      }
    };

    xhr.onerror = () =>
      reject({
        error: xhr.statusText || "Unable to upload this document.",
        status: "CUSTOM_ERROR",
      });
    xhr.onabort = () =>
      reject({
        error: "Upload cancelled.",
        status: "CUSTOM_ERROR",
      });
    signal.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(body);
  });

export const documentApi = globalApi.injectEndpoints({
  endpoints: (builder) => ({
    listDocuments: builder.query<DocumentRecord[], string | undefined>({
      query: (userId) => ({
        url: DOCUMENT_ENDPOINTS.list,
        method: "GET",
        params: userId ? { userId } : undefined,
      }),
      transformResponse: normalizeDocumentsResponse,
      providesTags: (documents) =>
        documents
          ? [
              { type: "Document" as const, id: "LIST" },
              ...documents.map((document) => ({
                type: "Document" as const,
                id: document.id,
              })),
            ]
          : [{ type: "Document" as const, id: "LIST" }],
    }),
    uploadDocument: builder.mutation<UploadDocumentResponse, UploadDocumentPayload>({
      async queryFn(payload, api) {
        try {
          const token = (api.getState() as RootState).auth.token;
          const data = await uploadDocumentWithProgress(
            `${API_BASE_URL}${DOCUMENT_ENDPOINTS.upload}`,
            payload,
            token,
            api.signal,
          );

          return { data };
        } catch (error) {
          if (isUploadDocumentRequestError(error)) {
            return { error };
          }

          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                    ? error
                    : "Unable to upload this document.",
              data: error,
            },
          };
        }
      },
      invalidatesTags: [{ type: "Document", id: "LIST" }],
    }),
    deleteDocument: builder.mutation<DeleteDocumentResponse, string>({
      query: (documentId) => ({
        url: DOCUMENT_ENDPOINTS.delete,
        method: "DELETE",
        params: { documentId },
      }),
      transformResponse: (response: ApiEnvelope<DeleteDocumentResponse>) =>
        response.data,
      async onQueryStarted(documentId, { dispatch, getState, queryFulfilled }) {
        const userId = (getState() as RootState).auth.user?.id;
        const patch = userId
          ? dispatch(
              documentApi.util.updateQueryData("listDocuments", userId, (draft) => {
                const documentIndex = draft.findIndex(
                  (document) => document.id === documentId,
                );

                if (documentIndex !== -1) {
                  draft.splice(documentIndex, 1);
                }
              }),
            )
          : undefined;

        try {
          await queryFulfilled;
        } catch {
          patch?.undo();
        }
      },
      invalidatesTags: (_result, _error, documentId) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id: documentId },
      ],
    }),
    getDocumentConversations: builder.query<DocumentConversationRecord[], string>({
      query: (documentId) => ({
        url: DOCUMENT_ENDPOINTS.conversations,
        method: "GET",
        params: { documentId },
      }),
      transformResponse: normalizeDocumentConversationsResponse,
      providesTags: (_result, _error, documentId) => [
        { type: "Conversation", id: documentId },
      ],
    }),
    searchDocument: builder.mutation<SearchDocumentResponse, SearchDocumentPayload>({
      async queryFn(payload, api) {
        try {
          const token = (api.getState() as RootState).auth.token;
          const response = await fetch(`${API_BASE_URL}${DOCUMENT_ENDPOINTS.search}`, {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: await readResponseError(response),
              },
            };
          }

          return {
            data: await readSearchStream(response),
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Unable to search this document.",
            },
          };
        }
      },
      invalidatesTags: ["Document"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useDeleteDocumentMutation,
  useGetDocumentConversationsQuery,
  useListDocumentsQuery,
  useSearchDocumentMutation,
  useUploadDocumentMutation,
} = documentApi;
