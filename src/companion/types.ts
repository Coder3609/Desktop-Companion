export type CompanionState = 'Sleeping' | 'Idle' | 'Listening' | 'Thinking' | 'Talking' | 'Working' | 'Watching' | 'Celebrating' | 'Hidden' | 'Error';

export interface EmotionData {
  valence: number; // -1 (negative) to 1 (positive)
  arousal: number; // 0 (calm) to 1 (excited)
}

export interface CharacterPackage {
  id: string;
  modelUrl: string;
}

export interface CharacterRenderer {
  initialize(canvas: HTMLCanvasElement, packageData: CharacterPackage): Promise<void>;
  
  // State changes
  setState(state: CompanionState): void;
  setEmotion(emotion: EmotionData): void;
  
  // Continuous actions
  setLipSync(amplitude: number): void;
  lookAt(x: number, y: number): void;
  
  // Triggers
  playGesture(gestureName: string): Promise<void>;
  
  // Visibility
  hide(): void;
  show(): void;
}
