use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::time::SystemTime;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEntry {
    pub path: String,
    pub size: u64,
    pub last_accessed: String,
    pub last_modified: String,
    pub file_type: String,
    pub is_hidden: bool,
}

pub fn scan_path(path: String, max_files: Option<usize>) -> Result<Vec<FileEntry>, String> {
    let mut results: Vec<FileEntry> = Vec::new();
    let cap = max_files.unwrap_or(200_000);

    for entry in WalkDir::new(path).follow_links(false).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }

        let Ok(metadata) = entry.metadata() else {
            continue;
        };

        let path_buf = entry.path().to_path_buf();
        let as_string = path_buf.to_string_lossy().to_string();

        let last_accessed = metadata
            .accessed()
            .ok()
            .map(to_iso)
            .unwrap_or_else(|| Utc::now().to_rfc3339());

        let last_modified = metadata
            .modified()
            .ok()
            .map(to_iso)
            .unwrap_or_else(|| Utc::now().to_rfc3339());

        results.push(FileEntry {
            path: as_string,
            size: metadata.len(),
            last_accessed,
            last_modified,
            file_type: classify_type(&path_buf),
            is_hidden: is_hidden_file(&path_buf),
        });

        if results.len() >= cap {
            break;
        }
    }

    Ok(results)
}

fn to_iso(value: SystemTime) -> String {
    let datetime: DateTime<Utc> = value.into();
    datetime.to_rfc3339()
}

fn classify_type(path: &Path) -> String {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_lowercase())
        .unwrap_or_else(|| String::from("unknown"));

    match ext.as_str() {
        "mp4" | "mkv" | "mov" | "avi" => String::from("video"),
        "jpg" | "jpeg" | "png" | "gif" | "webp" => String::from("image"),
        "pdf" | "doc" | "docx" | "txt" | "md" => String::from("document"),
        "zip" | "7z" | "rar" | "tar" | "gz" | "iso" => String::from("archive"),
        "exe" | "msi" | "dmg" | "pkg" => String::from("installer"),
        "mp3" | "wav" | "flac" => String::from("audio"),
        _ => ext,
    }
}

fn is_hidden_file(path: &Path) -> bool {
    path.file_name()
        .and_then(|name| name.to_str())
        .map(|name| name.starts_with('.'))
        .unwrap_or(false)
}
