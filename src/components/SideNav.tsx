import { useStore } from "../store/useStore";
import { TabKey } from "../types";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "large", label: "Large Files" },
  { key: "duplicates", label: "Duplicates" },
  { key: "unused", label: "Unused" },
  { key: "temp", label: "Temp / Cache" }
];

export function SideNav() {
  const { selectedTab, setSelectedTab } = useStore();

  return (
    <aside className="glass h-fit w-full rounded-2xl p-3 md:w-56">
      <p className="px-2 pb-2 text-xs uppercase tracking-[0.25em] text-mist/60">DiskSage</p>
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
              selectedTab === tab.key
                ? "bg-ember text-ink shadow-glow"
                : "text-mist/85 hover:bg-mist/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
