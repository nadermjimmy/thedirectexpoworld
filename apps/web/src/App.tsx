import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { Scene } from "./scene/Scene";
import type { ViewMode } from "./scene/Scene";
import { BoothPanel } from "./ui/BoothPanel";

// emulate: false → don't inject the dev XR button or pull the emulator bundle.
// On an XR-capable device/browser (Railway is HTTPS) the "Enter VR" button
// below starts a real WebXR session.
const xrStore = createXRStore({ emulate: false });

export function App() {
  // null = no panel open. Clicking a booth toggles it; clicking another swaps.
  const [openDeveloper, setOpenDeveloper] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>("orbit");

  const handleSelectDeveloper = (id: string) =>
    setOpenDeveloper((current) => (current === id ? null : id));

  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas
          shadows
          camera={{ position: [0, 21, 26], fov: 44 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <XR store={xrStore}>
            <Suspense fallback={null}>
              <Scene
                activeDeveloper={openDeveloper}
                onSelectDeveloper={handleSelectDeveloper}
                mode={mode}
              />
            </Suspense>
          </XR>
        </Canvas>

        <div className="view-controls">
          <button
            className={`mode-btn ${mode === "orbit" ? "is-active" : ""}`}
            onClick={() => setMode("orbit")}
          >
            Overview
          </button>
          <button
            className={`mode-btn ${mode === "walk" ? "is-active" : ""}`}
            onClick={() => setMode("walk")}
          >
            Walk the floor
          </button>
        </div>

        {mode === "walk" && (
          <div className="walk-hint">
            Click to look around · <strong>WASD</strong> to move · <strong>Shift</strong> to run ·
            <strong> Esc</strong> to release the cursor
          </div>
        )}

        <button className="xr-btn" onClick={() => xrStore.enterVR()}>
          Enter VR
        </button>

        {/* Floating, non-blocking developer details — slides over the scene
            on the right without dimming or covering it. */}
        <BoothPanel developerId={openDeveloper} onClose={() => setOpenDeveloper(null)} />
      </div>
    </div>
  );
}
