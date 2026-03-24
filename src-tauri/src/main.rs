#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod analyzer;
mod cleaner;
mod duplicates;
mod recommender;
mod scanner;
mod temp_finder;

use analyzer::AnalysisSummary;
use cleaner::BatchDeleteResult;
use duplicates::DuplicateGroup;
use recommender::Recommendation;
use scanner::FileEntry;
use temp_finder::TempCategory;

#[tauri::command]
async fn scan_files(path: String, max_files: Option<usize>) -> Result<Vec<FileEntry>, String> {
    tauri::async_runtime::spawn_blocking(move || scanner::scan_path(path, max_files))
        .await
        .map_err(|e| format!("scan task failed: {e}"))?
}

#[tauri::command]
fn analyze_files(
    files: Vec<FileEntry>,
    large_threshold_mb: Option<u64>,
    unused_days: Option<u64>,
) -> AnalysisSummary {
    analyzer::analyze(
        &files,
        large_threshold_mb.unwrap_or(100),
        unused_days.unwrap_or(90),
    )
}

#[tauri::command]
async fn find_duplicates(paths: Vec<String>, algorithm: Option<String>) -> Vec<DuplicateGroup> {
    tauri::async_runtime::spawn_blocking(move || duplicates::find(paths, algorithm))
        .await
        .unwrap_or_default()
}

#[tauri::command]
async fn recommend_cleanup(
    files: Vec<FileEntry>,
    large_threshold_mb: Option<u64>,
    unused_days: Option<u64>,
) -> Vec<Recommendation> {
    tauri::async_runtime::spawn_blocking(move || {
        recommender::recommend(
            &files,
            large_threshold_mb.unwrap_or(100),
            unused_days.unwrap_or(90),
        )
    })
    .await
    .unwrap_or_default()
}

#[tauri::command]
async fn detect_temp_paths() -> Vec<TempCategory> {
    tauri::async_runtime::spawn_blocking(temp_finder::detect)
        .await
        .unwrap_or_default()
}

#[tauri::command]
fn clean_temp_path(path: String) -> Result<(), String> {
    temp_finder::clean_path(&path)
}

#[tauri::command]
fn safe_delete(path: String) -> Result<(), String> {
    cleaner::move_to_trash(&path)
}

#[tauri::command]
fn permanent_delete(path: String) -> Result<(), String> {
    cleaner::delete_permanently(&path)
}

#[tauri::command]
fn safe_delete_many(paths: Vec<String>) -> BatchDeleteResult {
    cleaner::move_many_to_trash(&paths)
}

#[tauri::command]
fn permanent_delete_many(paths: Vec<String>) -> BatchDeleteResult {
    cleaner::delete_many_permanently(&paths)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            scan_files,
            analyze_files,
            find_duplicates,
            recommend_cleanup,
            detect_temp_paths,
            clean_temp_path,
            safe_delete,
            permanent_delete,
            safe_delete_many,
            permanent_delete_many
        ])
        .run(tauri::generate_context!())
        .expect("error while running DiskSage");
}
