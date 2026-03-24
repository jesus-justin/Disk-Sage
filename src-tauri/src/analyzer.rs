use crate::scanner::FileEntry;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisSummary {
    pub total_files: usize,
    pub total_size: u64,
    pub by_type: HashMap<String, u64>,
    pub large_files: usize,
    pub old_files: usize,
}

pub fn analyze(files: &[FileEntry], large_threshold_mb: u64, unused_days: u64) -> AnalysisSummary {
    let mut by_type: HashMap<String, u64> = HashMap::new();
    let mut total_size = 0_u64;
    let mut large_files = 0_usize;
    let mut old_files = 0_usize;

    let large_threshold_bytes = large_threshold_mb.saturating_mul(1024 * 1024);
    let cutoff = chrono::Utc::now() - chrono::Duration::days(unused_days as i64);

    for file in files {
        total_size = total_size.saturating_add(file.size);
        *by_type.entry(file.file_type.clone()).or_insert(0) += file.size;

        if file.size >= large_threshold_bytes {
            large_files += 1;
        }

        let access_date = chrono::DateTime::parse_from_rfc3339(&file.last_accessed)
            .map(|d| d.with_timezone(&chrono::Utc))
            .unwrap_or_else(|_| chrono::Utc::now());

        if access_date < cutoff {
            old_files += 1;
        }
    }

    AnalysisSummary {
        total_files: files.len(),
        total_size,
        by_type,
        large_files,
        old_files,
    }
}
