import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { Scene } from "./scene/Scene";
import { MeetPanel } from "./ui/MeetPanel";

// emulate: false → don't inject the dev XR button or pull the emulator bundle.
// On an XR-capable device/browser (Railway is HTTPS) the "Enter VR" button
// below starts a real WebXR session.
const xrStore = createXRStore({ emulate: false });

export function App() {
  const [activeBooth, setActiveBooth] = useState("keynote");

  return (
    <div className="app">
      <div className="canvas-wrap">
        <div className="title-overlay">
          <h1>The Direct Expo World</h1>
          <p>Click a booth to schedule a Google Meet · drag to look around</p>
        </div>
        <Canvas shadows camera={{ position: [0, 2.5, 7], fov: 50 }}>
          <XR store={xrStore}>
            <Suspense fallback={null}>
              <Scene activeBooth={activeBooth} onSelectBooth={setActiveBooth} />
            </Suspense>
          </XR>
        </Canvas>
        <button className="xr-btn" onClick={() => xrStore.enterVR()}>
          Enter VR
        </button>
      </div>
      <aside className="sidebar">
        <MeetPanel activeBooth={activeBooth} />
      </aside>
    </div>
  );
}
