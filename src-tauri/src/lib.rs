pub mod event_bus;
pub mod managers;

use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;
use crate::managers::session::SessionManager;
use crate::managers::performance::PerformanceManager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize Event Bus
            event_bus::init_event_bus(app.handle());

            // Initialize Managers
            let session_manager = SessionManager::new();
            let performance_manager = PerformanceManager::new();
            
            app.manage(session_manager);
            app.manage(performance_manager);

            // Initialize System Tray
            let _tray = TrayIconBuilder::new()
                .tooltip("AI Companion OS")
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        println!("left click pressed and released");
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
