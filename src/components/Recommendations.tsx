import { useStore } from "../store/useStore";
import { formatBytes } from "../utils/formatters";

export function Recommendations() {
  const { recommendations, setDeleteTargets } = useStore();

  return (
    <section className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold">Smart Recommendations</h3>
      <p className="mt-1 text-sm text-mist/70">Confidence-based suggestions. Nothing is deleted without your approval.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {recommendations.length === 0 && (
          <p className="text-sm text-mist/65">Run a scan to generate recommendations.</p>
        )}

        {recommendations.map((item) => (
          <article key={item.id} className="rounded-xl border border-mist/10 bg-ink/60 p-3">
            <p className="text-sm text-mist/90">{item.reason}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-mist/70">
              <span>{item.files.length} files</span>
              <span>•</span>
              <span>{formatBytes(item.total_size)}</span>
              <span>•</span>
              <span>Confidence {(item.confidence * 100).toFixed(0)}%</span>
            </div>
            <button
              onClick={() => item.files[0] && setDeleteTargets([item.files[0]])}
              className="mt-3 rounded-lg bg-ember px-3 py-2 text-xs font-semibold text-ink hover:brightness-110"
            >
              Review First File
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
