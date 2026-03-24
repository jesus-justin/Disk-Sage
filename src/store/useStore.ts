import { create } from "zustand";
import { DuplicateGroup, FileEntry, Recommendation, TabKey, TempCategory } from "../types";

interface AppState {
  scanPath: string;
  isScanning: boolean;
  scanProgress: number;
  files: FileEntry[];
  duplicates: DuplicateGroup[];
  recommendations: Recommendation[];
  tempCategories: TempCategory[];
  selectedTab: TabKey;
  deleteTargets: FileEntry[];
  setScanPath: (path: string) => void;
  setScanning: (value: boolean) => void;
  setScanProgress: (value: number) => void;
  setFiles: (files: FileEntry[]) => void;
  setDuplicates: (groups: DuplicateGroup[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setTempCategories: (categories: TempCategory[]) => void;
  setSelectedTab: (tab: TabKey) => void;
  setDeleteTargets: (targets: FileEntry[]) => void;
}

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
