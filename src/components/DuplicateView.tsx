import { useStore } from "../store/useStore";
import { formatBytes } from "../utils/formatters";

export function DuplicateView() {
  const { duplicates } = useStore();

  return (
    <section className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold">Duplicate Groups</h3>
      <p className="mt-1 text-sm text-mist/70">Grouped by content hash with exact-match copies.</p>

      <div className="mt-3 space-y-3">
        {duplicates.length === 0 && <p className="text-sm text-mist/65">No duplicates found yet.</p>}
        {duplicates.map((group) => (
          <article key={group.hash} className="rounded-xl border border-mist/10 bg-ink/50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-mist/70">{group.hash.slice(0, 16)}...</p>
              <span className="rounded-full bg-ember/20 px-2 py-1 text-xs text-ember">
                {group.files.length} files · {formatBytes(group.total_size)}
              </span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-mist/80">
              {group.files.map((file) => (
                <li key={file.path} className="truncate font-mono">{file.path}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
