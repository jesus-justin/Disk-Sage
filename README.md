# DiskSage

Your disk's smartest advisor.

DiskSage is a cross-platform desktop app that scans your filesystem, identifies large, duplicate, old, and unused files, and recommends what to clean up while keeping you in full control.

## GitHub Description

DiskSage is a cross-platform desktop app that scans your filesystem, identifies large, duplicate, old, and unused files, and intelligently recommends what to clean up - always asking before it deletes anything.

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Backend: Tauri (Rust)
- Charts: Recharts
- State: Zustand

## Project Structure

```text
disksage/
|- src-tauri/
|  |- src/
|  |  |- main.rs
|  |  |- scanner.rs
|  |  |- analyzer.rs
|  |  |- duplicates.rs
|  |  |- recommender.rs
|  |  |- cleaner.rs
|  |  |- temp_finder.rs
|  |- Cargo.toml
|  |- tauri.conf.json
|
|- src/
|  |- components/
|  |  |- Dashboard.tsx
|  |  |- FileScanner.tsx
|  |  |- FileList.tsx
|  |  |- DuplicateView.tsx
|  |  |- Recommendations.tsx
|  |  |- TempCleaner.tsx
|  |  |- DeleteModal.tsx
|  |  |- SideNav.tsx
|  |- store/
|  |  |- useStore.ts
|  |- hooks/
|  |  |- useScanner.ts
|  |- utils/
|  |  |- formatters.ts
|  |- App.tsx
|  |- main.tsx
|
|- package.json
|- tailwind.config.js
|- tsconfig.json
|- README.md
```

## App Flow

1. User opens DiskSage.
2. Dashboard loads with disk summary and quick stats.
3. User picks a folder/drive to scan.
4. Rust backend scans filesystem for size, dates, type, duplicate hashes, and temp/cache candidates.
5. Results appear in tabs: Overview, Large Files, Duplicates, Unused, Temp/Cache.
6. Recommendations panel suggests cleanup candidates with reason + confidence.
7. User reviews and clicks delete.
8. Delete modal requires explicit confirmation for trash or permanent deletion.
9. Rust executes delete and records a local log entry.

## Features

1. File Size Scanner
- Recursive scan of selected path.
- File grouping by type.
- Sortable file table by size/date/type.
- Dashboard usage chart by category.

2. Duplicate File Finder
- MD5 hashing by default; SHA-256 option supported.
- Exact duplicate grouping.

3. Large/Old File Recommender
- Configurable large file threshold (default 100 MB).
- Configurable unused threshold (default 90 days).
- Confidence-based recommendations with reasoning.

4. Temp & Cache Cleaner
- Detects known temp/cache folders by OS.
- Shows estimated size by category.
- One-click cleanup endpoint with confirmation UI.

5. Unused File Recommender
- Uses size + access age + file type signals.
- Produces prioritized cleanup candidates.
- Never auto-deletes.

## Safety Rules

- Never auto-deletes anything.
- Move-to-trash is the default delete path.
- Permanent delete requires explicit second confirmation.
- Deletion logs are written locally.
- Basic path guards block common system locations.

## Development Phases

- Phase 1: Tauri setup + file scanner + basic file list UI
- Phase 2: Duplicate finder + temp cleaner
- Phase 3: Recommender engine + scoring logic
- Phase 4: Delete modal + safety logic + logging
- Phase 5: Dashboard charts + polish + packaging

## Local Development

### Prerequisites

- Node.js 18+
- Rust toolchain
- Tauri native prerequisites for your OS

### Install

```bash
npm.cmd install
```

### Run Frontend Only

```bash
npm.cmd run dev
```

### Run Desktop App (Tauri + React)

```bash
npm.cmd run tauri:dev
```

### Build

```bash
npm.cmd run tauri:build
```

## Notes

- The current scaffold is a functional baseline focused on architecture and safety-first behavior.
- Next iterations can add stronger system file detection, undo workflows, and richer visualization such as treemaps.
