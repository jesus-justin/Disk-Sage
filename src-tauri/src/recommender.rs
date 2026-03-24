use crate::scanner::FileEntry;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recommendation {
    pub id: String,
    pub reason: String,
    pub confidence: f32,
    pub total_size: u64,
    pub files: Vec<FileEntry>,
}

pub fn recommend(files: &[FileEntry], large_threshold_mb: u64, unused_days: u64) -> Vec<Recommendation> {
    let large_threshold = large_threshold_mb.saturating_mul(1024 * 1024);
    let cutoff = chrono::Utc::now() - chrono::Duration::days(unused_days as i64);

    let mut candidates: Vec<FileEntry> = files
        .iter()
        .filter(|file| {
            if file.path.to_ascii_lowercase().contains("windows") {
                return false;
            }

            let is_large = file.size >= large_threshold;
            let old_access = chrono::DateTime::parse_from_rfc3339(&file.last_accessed)
                .map(|d| d.with_timezone(&chrono::Utc) < cutoff)
                .unwrap_or(false);

            is_large || old_access
        })
        .cloned()
        .collect();

    candidates.sort_by(|a, b| b.size.cmp(&a.size));

    candidates
        .chunks(3)
        .enumerate()
        .map(|(index, chunk)| {
            let total_size = chunk.iter().map(|f| f.size).sum();
            let confidence = calculate_confidence(chunk, large_threshold, cutoff);
            Recommendation {
                id: format!("rec-{}", index + 1),
                reason: build_reason(chunk),
                confidence,
                total_size,
                files: chunk.to_vec(),
            }
        })
        .collect()
}

fn calculate_confidence(files: &[FileEntry], large_threshold: u64, cutoff: chrono::DateTime<chrono::Utc>) -> f32 {
    let mut score = 0.35_f32;

    for file in files {
        if file.size >= large_threshold {
            score += 0.18;
        }

        let is_old = chrono::DateTime::parse_from_rfc3339(&file.last_accessed)
            .map(|d| d.with_timezone(&chrono::Utc) < cutoff)
            .unwrap_or(false);

        if is_old {
            score += 0.22;
        }

        if matches!(file.file_type.as_str(), "archive" | "installer") {
            score += 0.1;
        }
    }

    score.min(0.95)
}

fn build_reason(files: &[FileEntry]) -> String {
    let total_size: u64 = files.iter().map(|f| f.size).sum();
    format!(
        "{} files look removable based on age/size patterns, totaling {:.2} GB.",
        files.len(),
        total_size as f64 / 1024_f64 / 1024_f64 / 1024_f64
    )
}
