import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../store/useStore";
import { formatBytes } from "../utils/formatters";

export function TempCleaner() {
  const { tempCategories } = useStore();

  const cleanTemp = async (path: string) => {
    await invoke("clean_temp_path", { path });
  };

  return (
    <section className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold">Temp & Cache Cleaner</h3>
      <p className="mt-1 text-sm text-mist/70">Known cache locations for your OS. Clean only after preview.</p>

      <div className="mt-3 space-y-2">
        {tempCategories.length === 0 && (
          <p className="text-sm text-mist/65">No temp categories loaded yet. Run a scan first.</p>
        )}
        {tempCategories.map((item) => (
          <div
            key={item.path}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-mist/10 bg-ink/55 p-3"
          >
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="font-mono text-xs text-mist/70">{item.path}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-mint/20 px-2 py-1 text-xs text-mint">
                {formatBytes(item.size_bytes)}
              </span>
              <button
                onClick={() => cleanTemp(item.path)}
                className="rounded-lg border border-ember/40 px-3 py-2 text-xs text-ember hover:bg-ember/15"
              >
                Clean
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
