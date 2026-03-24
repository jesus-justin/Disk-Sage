import { Dashboard } from "./components/Dashboard";
import { DeleteModal } from "./components/DeleteModal";
import { DuplicateView } from "./components/DuplicateView";
import { FileList } from "./components/FileList";
import { FileScanner } from "./components/FileScanner";
import { Recommendations } from "./components/Recommendations";
import { SideNav } from "./components/SideNav";
import { TempCleaner } from "./components/TempCleaner";
import { useStore } from "./store/useStore";
import logo from "./assets/logo.png";

export default function App() {
  const { selectedTab } = useStore();

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-4 md:flex-row md:p-6">
      <SideNav />

      <section className="flex-1 space-y-4">
        <header className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="DiskSage logo" className="h-10 w-10 rounded-lg object-cover" />
            <h1 className="text-2xl font-bold">DiskSage</h1>
          </div>
          <p className="text-sm text-mist/70">Your disk's smartest advisor.</p>
        </header>

        <FileScanner />
        <Dashboard />

        {selectedTab === "overview" && <Recommendations />}
        {selectedTab === "large" && <FileList />}
        {selectedTab === "duplicates" && <DuplicateView />}
        {selectedTab === "unused" && <Recommendations />}
        {selectedTab === "temp" && <TempCleaner />}
      </section>

      <DeleteModal />
    </main>
  );
}
