use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TempCategory {
    pub label: String,
    pub path: String,
    pub size_bytes: u64,
}

pub fn detect() -> Vec<TempCategory> {
    let mut paths: Vec<(String, PathBuf)> = Vec::new();

    #[cfg(target_os = "windows")]
    {
        if let Ok(temp) = std::env::var("TEMP") {
            paths.push((String::from("Windows TEMP"), PathBuf::from(temp)));
        }
        if let Ok(local) = std::env::var("LOCALAPPDATA") {
            paths.push((
                String::from("AppData Local Temp"),
                PathBuf::from(local).join("Temp"),
            ));
        }
    }

    #[cfg(target_os = "macos")]
    {
        if let Some(home) = dirs::home_dir() {
            paths.push((
                String::from("User Cache"),
                home.join("Library").join("Caches"),
            ));
        }
    }

    #[cfg(target_os = "linux")]
    {
        if let Some(home) = dirs::home_dir() {
            paths.push((String::from("User Cache"), home.join(".cache")));
        }
    }

    paths
        .into_iter()
        .filter(|(_, path)| path.exists())
        .map(|(label, path)| TempCategory {
            label,
            size_bytes: dir_size(&path),
            path: path.to_string_lossy().to_string(),
        })
        .collect()
}

pub fn clean_path(path: &str) -> Result<(), String> {
    let as_path = Path::new(path);
    if !as_path.exists() {
        return Ok(());
    }

    for entry in std::fs::read_dir(as_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let child = entry.path();

        if child.is_file() {
            std::fs::remove_file(child).map_err(|e| e.to_string())?;
        } else if child.is_dir() {
            std::fs::remove_dir_all(child).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

fn dir_size(path: &Path) -> u64 {
    if !path.exists() {
        return 0;
    }

    walkdir::WalkDir::new(path)
        .into_iter()
        .filter_map(Result::ok)
        .filter_map(|e| e.metadata().ok())
        .filter(|m| m.is_file())
        .map(|m| m.len())
        .sum()
}
