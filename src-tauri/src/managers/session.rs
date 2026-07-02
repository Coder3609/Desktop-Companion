use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SessionState {
    pub is_active: bool,
    pub session_id: String,
}

pub struct SessionManager {
    pub state: SessionState,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            state: SessionState {
                is_active: true,
                session_id: uuid::Uuid::new_v4().to_string(),
            },
        }
    }

    pub fn restore_session(&mut self) {
        println!("Restoring previous session...");
        // Logic for crash recovery to be implemented
    }
}
