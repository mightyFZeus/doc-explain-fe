import { DocumentChatScreen } from "@/screens/dashboard/documentChat/DocumentChatScreen";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  return <DocumentChatScreen documentId={documentId} />;
}
