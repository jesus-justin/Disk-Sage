import { create } from "zustand";
import { DuplicateGroup, FileEntry, Recommendation, TabKey, TempCategory } from "../types";

/** Application-wide state interface */
interface AppState {
  /** Path currently being scanned */
  scanPath: string;
  /** Whether a scan is currently in progress */
  isScanning: boolean;
  /** Progress percentage of current scan (0-100) */
  scanProgress: number;
  /** Discovered files from disk scan */
  files: FileEntry[];
  /** Grouped duplicate files */
  duplicates: DuplicateGroup[];
  /** Cleanup recommendations */
  recommendations: Recommendation[];
  /** Temporary file categories */
  tempCategories: TempCategory[];
  /** Currently active tab */
  selectedTab: TabKey;
  /** Files marked for deletion */
  deleteTargets: FileEntry[];
  /** Updates the current scan path */
  setScanPath: (path: string) => void;
  /** Updates scanning status */
  setScanning: (value: boolean) => void;
  /** Updates scan progress percentage */
  setScanProgress: (value: number) => void;
  /** Updates the files list */
  setFiles: (files: FileEntry[]) => void;
  /** Updates the duplicates list */
  setDuplicates: (groups: DuplicateGroup[]) => void;
  /** Updates cleanup recommendations */
  setRecommendations: (recommendations: Recommendation[]) => void;
  /** Updates temporary file categories */
  setTempCategories: (categories: TempCategory[]) => void;
  /** Updates the active tab */
  setSelectedTab: (tab: TabKey) => void;
  /** Updates files to be deleted */
  setDeleteTargets: (targets: FileEntry[]) => void;
}

/**
 * Global application state hook using Zustand
 * Manages all disk scanning, file analysis, and cleanup recommendations
 */
export const useStore = create<AppState>((set) => ({
  scanPath: "",
  isScanning: false,
  scanProgress: 0,
  files: [],
  duplicates: [],
  recommendations: [],
  tempCategories: [],
  selectedTab: "overview",
  deleteTargets: [],
  setScanPath: (path) => set({ scanPath: path }),
  setScanning: (isScanning) => set({ isScanning }),
  setScanProgress: (scanProgress) => set({ scanProgress }),
  setFiles: (files) => set({ files }),
  setDuplicates: (duplicates) => set({ duplicates }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setTempCategories: (tempCategories) => set({ tempCategories }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setDeleteTargets: (deleteTargets) => set({ deleteTargets })
}));
