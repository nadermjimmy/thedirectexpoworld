import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { Scene } from "./scene/Scene";
import { MeetPanel } from "./ui/MeetPanel";
import { FIRST_DEVELOPER } from "./scene/developers";
import tdeHeaderLogo from "./assets/images/TDE_header.png";

const KEY_ITEMS = [
  "30 Developer Booths",
  "Curved Contemporary Design",
  "Networking & Lounge Areas",
  "Information Desk",
  "VIP Lounge",
  "Main Walkways",
];

// emulate: false → don't inject the dev XR button or pull the emulator bundle.
// On an XR-capable device/browser (Railway is HTTPS) the "Enter VR" button
// below starts a real WebXR session.
const xrStore = createXRStore({ emulate: false });

export function App() {
  const [activeDeveloper, setActiveDeveloper] = useState(FIRST_DEVELOPER.id);

  return (
    <div className="app">
      <div className="canvas-wrap">
        {/* <header className="expo-header">
          <img src={tdeHeaderLogo} alt="The Direct Expo" className="expo-logo" />
          <div className="expo-tagline">CONNECT&nbsp;&nbsp;•&nbsp;&nbsp;EXPLORE&nbsp;&nbsp;•&nbsp;&nbsp;INVEST</div>
        </header> */}

        {/* <div className="floor-key">
          <h2>KEY</h2>
          <ul>
            {KEY_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="key-hint">Click any booth to schedule a Google Meet · drag to look around</p>
        </div> */}

        <Canvas
          shadows
          camera={{ position: [0, 21, 26], fov: 44 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <XR store={xrStore}>
            <Suspense fallback={null}>
              <Scene
                activeDeveloper={activeDeveloper}
                onSelectDeveloper={setActiveDeveloper}
              />
            </Suspense>
          </XR>
        </Canvas>
        <button className="xr-btn" onClick={() => xrStore.enterVR()}>
          Enter VR
        </button>
      </div>
      <aside className="sidebar">
        <MeetPanel activeDeveloper={activeDeveloper} />
      </aside>
    </div>
  );
}
