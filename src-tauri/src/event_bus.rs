use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Listener};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CompanionEvent {
    pub event_type: String,
    pub payload: serde_json::Value,
}

pub fn emit_event(app: &AppHandle, event: CompanionEvent) {
    let _ = app.emit("companion-event", event);
}

pub fn init_event_bus(app: &AppHandle) {
    let app_handle = app.clone();
    app.listen("companion-event", move |event| {
        if let Ok(companion_event) = serde_json::from_str::<CompanionEvent>(event.payload()) {
            println!("Received event on bus: {:?}", companion_event.event_type);
            // Internal routing can happen here
        }
    });
}
