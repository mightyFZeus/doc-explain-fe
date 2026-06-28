import { API_BASE_URL } from "@/constants/endpoints";

export function buildWebSocketUrl(
  path: string,
  params: Record<string, string> = {},
) {
  const url = new URL(API_BASE_URL);
  const basePath = url.pathname.replace(/\/$/, "");
  const socketPath = path.startsWith("/") ? path : `/${path}`;

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${basePath}${socketPath}`;

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}
