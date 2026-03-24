import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import { FileEntry } from "../types";
import { formatBytes, formatRelativeDays } from "../utils/formatters";

type SortKey = "size" | "last_accessed" | "file_type";

export function FileList() {
  const { files, setDeleteTargets } = useStore();
  const [sortKey, setSortKey] = useState<SortKey>("size");
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const cloned = [...files];

    cloned.sort((a, b) => {
      if (sortKey === "size") return b.size - a.size;
      if (sortKey === "file_type") return a.file_type.localeCompare(b.file_type);
      return new Date(a.last_accessed).getTime() - new Date(b.last_accessed).getTime();
    });

    return cloned.slice(0, 250);
  }, [files, sortKey]);

  const openDelete = (file: FileEntry) => setDeleteTargets([file]);

  const toggleSelected = (path: string) => {
    setSelectedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const selectedCount = selectedPaths.size;
  const allVisibleSelected = sorted.length > 0 && sorted.every((file) => selectedPaths.has(file.path));

  const toggleSelectAllVisible = () => {
    setSelectedPaths((current) => {
      if (allVisibleSelected) {
        return new Set();
      }
      return new Set(sorted.map((file) => file.path));
    });
  };

  const reviewSelected = () => {
    const selectedFiles = sorted.filter((file) => selectedPaths.has(file.path));
    if (selectedFiles.length === 0) return;
    setDeleteTargets(selectedFiles);
  };

  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Scanned Files</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleSelectAllVisible}
            className="rounded-lg border border-mist/20 bg-ink/70 px-3 py-2 text-xs text-mist"
          >
            {allVisibleSelected ? "Clear Selection" : "Select Visible"}
          </button>
          <button
            onClick={reviewSelected}
            disabled={selectedCount === 0}
            className="rounded-lg border border-ember/40 px-3 py-2 text-xs text-ember disabled:opacity-50"
          >
            Delete Selected ({selectedCount})
          </button>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-mist/20 bg-ink/80 px-3 py-2 text-xs"
          >
            <option value="size">Sort: Size</option>
            <option value="last_accessed">Sort: Last Accessed</option>
            <option value="file_type">Sort: Type</option>
          </select>
        </div>
      </div>

      <div className="mt-3 max-h-[420px] overflow-auto rounded-xl border border-mist/10">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead className="bg-ink/80 text-left text-xs uppercase tracking-wider text-mist/70">
            <tr>
              <th className="px-3 py-2">Pick</th>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Last Used</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((file) => (
              <tr key={file.path} className="border-t border-mist/10 text-mist/90">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedPaths.has(file.path)}
                    onChange={() => toggleSelected(file.path)}
                    className="h-4 w-4 accent-ember"
                  />
                </td>
                <td className="max-w-[420px] truncate px-3 py-2 font-mono text-xs">{file.path}</td>
                <td className="px-3 py-2">{file.file_type}</td>
                <td className="px-3 py-2">{formatBytes(file.size)}</td>
                <td className="px-3 py-2">{formatRelativeDays(file.last_accessed)}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => openDelete(file)}
                    className="rounded-md border border-ember/40 px-2 py-1 text-xs text-ember hover:bg-ember/15"
                  >
                    Review Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
