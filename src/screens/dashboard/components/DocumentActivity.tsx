import { FileCheck2, FileClock, FileText } from "lucide-react";
import type { DocumentRecord, User } from "@/types/apiTypes";
import { DashboardPanel } from "./DashboardPanel";

export function DocumentActivity({
  documents,
  user,
}: {
  documents: DocumentRecord[];
  user: User | null;
}) {
  const readyCount = documents.filter((document) =>
    ["ready", "completed", "success"].includes(
      (document.proccessingStatus ?? document.status ?? "").toLowerCase(),
    ),
  ).length;

  return (
    <DashboardPanel title="Workspace">
      <div className="space-y-5">
        <div className="rounded-md border border-line bg-canvas p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            User
          </p>
          <p className="mt-2 text-sm font-medium text-ink">
            {user?.fullName ?? "No active user"}
          </p>
          <p className="mt-1 text-sm text-muted">{user?.email ?? "Local testing"}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border border-line bg-canvas p-4">
            <FileText className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-ink">Documents</p>
              <p className="text-xs text-muted">{documents.length} in library</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-line bg-canvas p-4">
            <FileCheck2 className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-ink">Ready</p>
              <p className="text-xs text-muted">{readyCount} searchable</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-line bg-canvas p-4">
            <FileClock className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-ink">List endpoint</p>
              <p className="text-xs text-muted">GET /document</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
