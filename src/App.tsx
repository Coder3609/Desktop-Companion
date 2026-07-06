import { useEffect } from "react";
import "./App.css";

import { VrmRenderer } from "./companion/VrmRenderer";

function App() {
  return (
    <main className="companion-container">
      <div className="placeholder-character">
        <VrmRenderer 
          character={{ id: 'default', modelUrl: '/models/default.vrm' }} 
          state="Idle" 
        />
        <div style={{ position: 'absolute', pointerEvents: 'none', textAlign: 'center' }}>
          <h2>Companion OS</h2>
          <p>Drop default.vrm in public/models/</p>
        </div>
      </div>
    </main>
  );
}

export default App;
