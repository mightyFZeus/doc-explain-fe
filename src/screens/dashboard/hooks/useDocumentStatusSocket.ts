"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DOCUMENT_ENDPOINTS } from "@/constants/endpoints";
import { isDocumentProcessing } from "@/lib/documentStatus";
import { buildWebSocketUrl } from "@/lib/webSocket";
import type { DocumentRecord, DocumentStatusEvent } from "@/types/apiTypes";

type SocketState = "connecting" | "open" | "closed";

const isDocumentStatusEvent = (value: unknown): value is DocumentStatusEvent =>
  Boolean(
    value &&
      typeof value === "object" &&
      "documentId" in value &&
      typeof (value as { documentId?: unknown }).documentId === "string",
  );

const parseStatusEvent = (message: MessageEvent): DocumentStatusEvent | null => {
  if (typeof message.data !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(message.data) as unknown;
    const event =
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      isDocumentStatusEvent((parsed as { data?: unknown }).data)
        ? (parsed as { data: DocumentStatusEvent }).data
        : parsed;

    return isDocumentStatusEvent(event) ? event : null;
  } catch {
    return null;
  }
};

export function useDocumentStatusSocket({
  authToken,
  documents,
  onStatusEvent,
}: {
  authToken?: string | null;
  documents: DocumentRecord[];
  onStatusEvent: (event: DocumentStatusEvent) => void;
}) {
  const onStatusEventRef = useRef(onStatusEvent);
  const [socketStateById, setSocketStateById] = useState<Record<string, SocketState>>(
    {},
  );

  const trackedDocumentIds = useMemo(
    () =>
      Array.from(
        new Set(
          documents
            .filter(isDocumentProcessing)
            .map((document) => document.id)
            .filter(Boolean),
        ),
      ).sort(),
    [documents],
  );
  const trackedDocumentKey = trackedDocumentIds.join("|");
  const trackedDocumentIdSet = useMemo(
    () => new Set(trackedDocumentIds),
    [trackedDocumentIds],
  );

  useEffect(() => {
    onStatusEventRef.current = onStatusEvent;
  }, [onStatusEvent]);

  useEffect(() => {
    const trackedIds = trackedDocumentKey ? trackedDocumentKey.split("|") : [];
    let isDisposed = false;
    const sockets: WebSocket[] = [];
    const reconnectTimers: number[] = [];

    if (!trackedIds.length || !authToken || typeof window === "undefined") {
      return undefined;
    }

    const connect = (documentId: string) => {
      if (isDisposed) {
        return;
      }

      setSocketStateById((current) => ({
        ...current,
        [documentId]: "connecting",
      }));

      let socket: WebSocket;

      try {
        socket = new WebSocket(
          buildWebSocketUrl(DOCUMENT_ENDPOINTS.statusSocket, {
            documentId,
            token: authToken,
          }),
        );
      } catch {
        setSocketStateById((current) => ({
          ...current,
          [documentId]: "closed",
        }));
        return;
      }

      sockets.push(socket);

      socket.onopen = () => {
        if (!isDisposed) {
          setSocketStateById((current) => ({
            ...current,
            [documentId]: "open",
          }));
        }
      };

      socket.onmessage = (message) => {
        const event = parseStatusEvent(message);

        if (event) {
          onStatusEventRef.current(event);
        }
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onclose = () => {
        if (isDisposed) {
          return;
        }

        setSocketStateById((current) => ({
          ...current,
          [documentId]: "closed",
        }));

        const reconnectTimer = window.setTimeout(() => connect(documentId), 3000);
        reconnectTimers.push(reconnectTimer);
      };
    };

    trackedIds.forEach(connect);

    return () => {
      isDisposed = true;
      reconnectTimers.forEach((timer) => window.clearTimeout(timer));
      sockets.forEach((socket) => socket.close());
    };
  }, [authToken, trackedDocumentKey]);

  const liveDocumentIds = useMemo(
    () =>
      new Set(
        Object.entries(socketStateById)
          .filter(
            ([documentId, state]) =>
              trackedDocumentIdSet.has(documentId) && state === "open",
          )
          .map(([documentId]) => documentId),
      ),
    [socketStateById, trackedDocumentIdSet],
  );

  return {
    liveDocumentIds,
    socketStateById,
  };
}
