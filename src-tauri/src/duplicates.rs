use crate::scanner::FileEntry;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Read};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DuplicateGroup {
    pub hash: String,
    pub files: Vec<FileEntry>,
    pub total_size: u64,
}

pub fn find(paths: Vec<String>, algorithm: Option<String>) -> Vec<DuplicateGroup> {
    // Fast pre-filter: only files sharing the same byte size can be duplicates.
    let mut by_size: HashMap<u64, Vec<String>> = HashMap::new();
    for path in paths {
        let Ok(metadata) = std::fs::metadata(&path) else {
            continue;
        };
        if !metadata.is_file() {
            continue;
        }
        by_size.entry(metadata.len()).or_default().push(path);
    }

    let mut grouped: HashMap<String, Vec<String>> = HashMap::new();

    for same_size_paths in by_size.into_values().filter(|group| group.len() > 1) {
        for path in same_size_paths {
            let hash = match hash_file(&path, algorithm.as_deref().unwrap_or("md5")) {
                Ok(value) => value,
                Err(_) => continue,
            };
            grouped.entry(hash).or_default().push(path);
        }
    }

    grouped
        .into_iter()
        .filter(|(_, files)| files.len() > 1)
        .map(|(hash, files)| {
            let entries: Vec<FileEntry> = files
                .into_iter()
                .filter_map(|path| {
                    let Ok(metadata) = std::fs::metadata(&path) else {
                        return None;
                    };

                    let modified = metadata
                        .modified()
                        .ok()
                        .map(|t| {
                            let dt: chrono::DateTime<chrono::Utc> = t.into();
                            dt.to_rfc3339()
                        })
                        .unwrap_or_else(|| chrono::Utc::now().to_rfc3339());

                    let accessed = metadata
                        .accessed()
                        .ok()
                        .map(|t| {
                            let dt: chrono::DateTime<chrono::Utc> = t.into();
                            dt.to_rfc3339()
                        })
                        .unwrap_or_else(|| modified.clone());

                    Some(FileEntry {
                        path,
                        size: metadata.len(),
                        last_accessed: accessed,
                        last_modified: modified,
                        file_type: String::from("unknown"),
                        is_hidden: false,
                    })
                })
                .collect();

            let total_size = entries.iter().map(|f| f.size).sum();
            DuplicateGroup {
                hash,
                files: entries,
                total_size,
            }
        })
        .collect()
}

fn hash_file(path: &str, algorithm: &str) -> Result<String, String> {
    let file = File::open(path).map_err(|e| format!("open failed: {e}"))?;
    let mut reader = BufReader::new(file);
    let mut chunk = [0_u8; 64 * 1024];

    if algorithm.eq_ignore_ascii_case("sha256") {
        let mut hasher = Sha256::new();
        loop {
            let read = reader.read(&mut chunk).map_err(|e| format!("read failed: {e}"))?;
            if read == 0 {
                break;
            }
            hasher.update(&chunk[..read]);
        }
        return Ok(format!("{:x}", hasher.finalize()));
    }

    let mut context = md5::Context::new();
    loop {
        let read = reader.read(&mut chunk).map_err(|e| format!("read failed: {e}"))?;
        if read == 0 {
            break;
        }
        context.consume(&chunk[..read]);
    }

    Ok(format!("{:x}", context.compute()))
}
