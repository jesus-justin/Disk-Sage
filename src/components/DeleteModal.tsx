import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../store/useStore";
import { formatBytes, formatRelativeDays } from "../utils/formatters";

interface BatchDeleteResult {
  deleted: string[];
  failed: Array<{ path: string; error: string }>;
}

export function DeleteModal() {
  const { deleteTargets, setDeleteTargets, files, setFiles } = useStore();

  if (deleteTargets.length === 0) return null;

  const close = () => setDeleteTargets([]);

  const selectedPaths = deleteTargets.map((file) => file.path);
  const totalSize = deleteTargets.reduce((sum, file) => sum + file.size, 0);

  const moveToTrash = async () => {
    const result = await invoke<BatchDeleteResult>("safe_delete_many", { paths: selectedPaths });
    if (result.deleted.length > 0) {
      const deletedSet = new Set(result.deleted);
      setFiles(files.filter((file) => !deletedSet.has(file.path)));
    }
    if (result.failed.length > 0) {
      alert(`Some files could not be deleted:\n${result.failed.map((f) => `${f.path}: ${f.error}`).join("\n")}`);
    }
    close();
  };

  const permanentlyDelete = async () => {
    const reallySure = window.confirm(
      "Permanent delete cannot be undone. Type safety still applies, but this bypasses Trash. Continue?"
    );
    if (!reallySure) return;

    const result = await invoke<BatchDeleteResult>("permanent_delete_many", { paths: selectedPaths });
    if (result.deleted.length > 0) {
      const deletedSet = new Set(result.deleted);
      setFiles(files.filter((file) => !deletedSet.has(file.path)));
    }
    if (result.failed.length > 0) {
      alert(`Some files could not be deleted:\n${result.failed.map((f) => `${f.path}: ${f.error}`).join("\n")}`);
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
      <div className="glass w-full max-w-xl rounded-2xl border border-ember/30 p-6">
        <h4 className="text-lg font-semibold text-ember">Confirm Deletion</h4>
        <p className="mt-2 text-sm text-mist/80">Review selected files before any delete action.</p>

        <div className="mt-4 space-y-2 rounded-xl border border-mist/10 bg-ink/60 p-3 text-sm">
          <p>Files selected: {deleteTargets.length}</p>
          <p>Total size: {formatBytes(totalSize)}</p>
          <div className="max-h-52 space-y-1 overflow-auto rounded-lg border border-mist/10 bg-ink/40 p-2">
            {deleteTargets.slice(0, 30).map((file) => (
              <div key={file.path} className="text-xs text-mist/80">
                <p className="truncate font-mono">{file.path}</p>
                <p className="text-mist/60">{formatBytes(file.size)} · Last used {formatRelativeDays(file.last_accessed)}</p>
              </div>
            ))}
            {deleteTargets.length > 30 && (
              <p className="text-xs text-mist/60">...and {deleteTargets.length - 30} more files.</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button onClick={close} className="rounded-lg border border-mist/30 px-3 py-2 text-sm text-mist">
            Cancel
          </button>
          <button
            onClick={moveToTrash}
            className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-ink"
          >
            Move To Trash
          </button>
          <button
            onClick={permanentlyDelete}
            className="rounded-lg bg-ember px-3 py-2 text-sm font-semibold text-ink"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
