import { API_BASE_URL, DOCUMENT_ENDPOINTS } from "@/constants/endpoints";
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
      query: ({ file, title, userId }) => {
        const body = new FormData();
        body.append("document", file);

        if (title) {
          body.append("title", title);
        }

        if (userId) {
          body.append("userId", userId);
        }

        return {
          url: DOCUMENT_ENDPOINTS.upload,
          method: "POST",
          body,
        };
      },
      transformResponse: (response: ApiEnvelope<UploadDocumentResponse>) =>
        response.data,
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
      async queryFn(payload) {
        try {
          const response = await fetch(`${API_BASE_URL}${DOCUMENT_ENDPOINTS.search}`, {
            method: "POST",
            headers: {
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
