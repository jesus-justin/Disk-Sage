import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { useStore } from "../store/useStore";
import { formatBytes } from "../utils/formatters";

const chartColors = ["#FF6B35", "#00A878", "#4EC5F1", "#F7B32B", "#9D7CFC"];

export function Dashboard() {
  const { files, duplicates, recommendations } = useStore();

  const totalBytes = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    for (const file of files) {
      map.set(file.file_type, (map.get(file.file_type) ?? 0) + file.size);
    }

    return [...map.entries()]
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 6);
  }, [files]);

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Files Scanned" value={String(files.length)} />
        <StatCard label="Total Size" value={formatBytes(totalBytes)} />
        <StatCard label="Duplicate Groups" value={String(duplicates.length)} />
        <StatCard label="Recommendations" value={String(recommendations.length)} />
      </div>

      <div className="glass desktop-chart rounded-2xl p-4">
        <h3 className="text-lg font-semibold">Space Usage By Type</h3>
        <div className="mt-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType}>
              <XAxis dataKey="name" tick={{ fill: "#EAF0F8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#C3D0E3", fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => formatBytes(value)}
                contentStyle={{ background: "#10131A", border: "1px solid #2d3545" }}
              />
              <Bar dataKey="size" radius={[8, 8, 0, 0]}>
                {byType.map((entry, i) => (
                  <Cell key={`${entry.name}-${i}`} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="glass rounded-xl p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-mist/60">{label}</p>
      <p className="mt-2 text-xl font-semibold text-mist">{value}</p>
    </article>
  );
}
