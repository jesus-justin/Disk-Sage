import { useScanner } from "../hooks/useScanner";
import { useStore } from "../store/useStore";

export function FileScanner() {
  const { scanPath, setScanPath, isScanning, scanProgress } = useStore();
  const { runScan } = useScanner();

  return (
    <section className="glass rounded-2xl p-4">
      <h2 className="text-lg font-semibold">Scan A Folder Or Drive</h2>
      <p className="mt-1 text-sm text-mist/70">
        DiskSage scans size, age, type, duplicates, and temp locations before making suggestions.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          value={scanPath}
          onChange={(e) => setScanPath(e.target.value)}
          placeholder="C:/Users/YourName/Downloads"
          className="w-full rounded-xl border border-mist/20 bg-ink/70 px-4 py-3 text-sm outline-none focus:border-ember"
        />
        <button
          onClick={runScan}
          disabled={isScanning || !scanPath.trim()}
          className="rounded-xl bg-mint px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isScanning ? "Scanning..." : "Start Scan"}
        </button>
      </div>

      {scanProgress > 0 && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate">
          <div
            className="h-full bg-gradient-to-r from-ember to-mint transition-all duration-300"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      )}
    </section>
  );
}
