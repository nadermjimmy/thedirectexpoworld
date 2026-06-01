import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene/Scene";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
