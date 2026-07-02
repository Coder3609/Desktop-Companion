use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum PerformanceMode {
    Eco,
    Balanced,
    Performance,
}

pub struct PerformanceManager {
    pub current_mode: PerformanceMode,
}

impl PerformanceManager {
    pub fn new() -> Self {
        Self {
            current_mode: PerformanceMode::Balanced,
        }
    }

    pub fn set_mode(&mut self, mode: PerformanceMode) {
        println!("Switching performance mode to {:?}", mode);
        self.current_mode = mode;
        // Trigger event to frontend to adjust rendering quality
    }
}
