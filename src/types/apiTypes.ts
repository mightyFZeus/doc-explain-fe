export interface ApiEnvelope<T> {
  data: T;
}

export interface HealthResponse {
  status: string;
  env: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  accountType?: "guest" | "user" | string;
  guestExpiresAt?: string;
  termsAccepted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user?: User;
  token?: string;
  accessToken?: string;
}

export interface TrialLimits {
  documents: number;
  questions: number;
}

export interface TrialUsage {
  documents: number;
  questions: number;
}

export interface GuestTrialResponse {
  expiresAt: string;
  limits: TrialLimits;
  token: string;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyEmailPayload {
  email: string;
  token: string;
}

export interface UploadDocumentPayload {
  file: File;
  progressKey?: string;
  title?: string;
  userId?: string;
}

export interface UploadDocumentProgress {
  loaded: number;
  percent: number;
  total: number;
}

export interface DocumentRecord {
  id: string;
  userId?: string;
  title: string;
  originalFilename?: string;
  fileType?: string;
  sourceType?: string;
  storageKey?: string;
  status?: string;
  classification?: string;
  classificationConfidence?: number;
  summary?: string;
  pageCount?: number;
  chunkCount?: number;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  processingStatus?: string;
  proccessingStatus?: string;
  error?: string;
}

export interface DocumentStatusEvent {
  documentId: string;
  status?: string;
  processingStatus?: string;
  proccessingStatus?: string;
  chunkCount?: number;
  error?: string;
  updatedAt?: string;
}

export interface UploadDocumentResponse {
  documentId: string;
  url: string;
  status: string;
}

export interface DeleteDocumentResponse {
  message?: string;
  status?: string;
}

export interface DocumentConversationMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | string;
  content: string;
  metadata?: unknown;
  createdAt: string;
}

export interface DocumentConversationRecord {
  id: string;
  documentId: string;
  userId?: string;
  title?: string;
  summary?: string;
  messages?: DocumentConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentConversationsResponse {
  documentId: string;
  conversations: DocumentConversationRecord[];
  conversationCount: number;
}

export interface SearchDocumentPayload {
  documentId: string;
  query: string;
}

export interface SearchDocumentResponse {
  answer: string;
  done: boolean;
  status: "answered" | "no_results";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  status?: "streaming" | "complete" | "error";
}
