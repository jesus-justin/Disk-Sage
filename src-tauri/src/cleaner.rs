use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteLogEntry {
    pub path: String,
    pub mode: String,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatchDeleteResult {
    pub deleted: Vec<String>,
    pub failed: Vec<DeleteFailure>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteFailure {
    pub path: String,
    pub error: String,
}

pub fn move_to_trash(path: &str) -> Result<(), String> {
    guard_path(path)?;
    trash::delete(path).map_err(|e| format!("trash failed: {e}"))?;
    append_log(path, "trash")
}

pub fn delete_permanently(path: &str) -> Result<(), String> {
    guard_path(path)?;
    let file_path = Path::new(path);

    if file_path.is_file() {
        std::fs::remove_file(file_path).map_err(|e| format!("delete file failed: {e}"))?;
    } else if file_path.is_dir() {
        std::fs::remove_dir_all(file_path).map_err(|e| format!("delete dir failed: {e}"))?;
    }

    append_log(path, "permanent")
}

pub fn move_many_to_trash(paths: &[String]) -> BatchDeleteResult {
    let mut deleted: Vec<String> = Vec::new();
    let mut failed: Vec<DeleteFailure> = Vec::new();

    for path in paths {
        match move_to_trash(path) {
            Ok(()) => deleted.push(path.clone()),
            Err(error) => failed.push(DeleteFailure {
                path: path.clone(),
                error,
            }),
        }
    }

    BatchDeleteResult { deleted, failed }
}

pub fn delete_many_permanently(paths: &[String]) -> BatchDeleteResult {
    let mut deleted: Vec<String> = Vec::new();
    let mut failed: Vec<DeleteFailure> = Vec::new();

    for path in paths {
        match delete_permanently(path) {
            Ok(()) => deleted.push(path.clone()),
            Err(error) => failed.push(DeleteFailure {
                path: path.clone(),
                error,
            }),
        }
    }

    BatchDeleteResult { deleted, failed }
}

fn guard_path(path: &str) -> Result<(), String> {
    let lower = path.to_ascii_lowercase();
    let blocked = ["windows", "program files", "system32", "$recycle.bin", "/system", "/bin", "/usr"];

    if blocked.iter().any(|needle| lower.contains(needle)) {
        return Err(String::from("Refusing to delete likely system path."));
    }

    Ok(())
}

fn append_log(path: &str, mode: &str) -> Result<(), String> {
    let base = dirs::data_local_dir().ok_or_else(|| String::from("Cannot resolve data dir"))?;
    let logs_dir = base.join("DiskSage");

    if !logs_dir.exists() {
        std::fs::create_dir_all(&logs_dir).map_err(|e| e.to_string())?;
    }

    let log_file = logs_dir.join("deletions.log");
    let entry = DeleteLogEntry {
        path: path.to_string(),
        mode: mode.to_string(),
        timestamp: Utc::now().to_rfc3339(),
    };

    let line = format!(
        "{}\t{}\t{}\n",
        entry.timestamp,
        entry.mode,
        entry.path
    );

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_file)
        .map_err(|e| e.to_string())?;

    file.write_all(line.as_bytes()).map_err(|e| e.to_string())
}
