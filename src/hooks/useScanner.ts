import { invoke } from "@tauri-apps/api/tauri";
import { useStore } from "../store/useStore";
import { DuplicateGroup, FileEntry, Recommendation, TempCategory } from "../types";

export const useScanner = () => {
  const {
    scanPath,
    setFiles,
    setDuplicates,
    setRecommendations,
    setTempCategories,
    setScanning,
    setScanProgress
  } = useStore();

  const runScan = async () => {
    if (!scanPath.trim()) return;

    setScanning(true);
    setScanProgress(15);

    try {
      const files = await invoke<FileEntry[]>("scan_files", {
        path: scanPath,
        maxFiles: 20_000
      });
      setFiles(files);
      setScanProgress(45);

      const duplicates = await invoke<DuplicateGroup[]>("find_duplicates", {
        paths: files.map((f) => f.path),
        algorithm: "md5"
      });
      setDuplicates(duplicates);
      setScanProgress(70);

      const recommendations = await invoke<Recommendation[]>("recommend_cleanup", {
        files,
        largeThresholdMb: 100,
        unusedDays: 90
      });
      setRecommendations(recommendations);

      const tempCategories = await invoke<TempCategory[]>("detect_temp_paths", {});
      setTempCategories(tempCategories);
      setScanProgress(100);
    } finally {
      setScanning(false);
      setTimeout(() => setScanProgress(0), 600);
    }
  };

  return { runScan };
};
