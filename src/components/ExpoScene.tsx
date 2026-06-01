"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import ExpoHall from "./ExpoHall";

export default function ExpoScene() {
  return (
    <Canvas shadows>
      <OrthographicCamera
        makeDefault
        position={[30, 30, 30]}
        zoom={18}
        near={0.1}
        far={1000}
      />
      <OrbitControls
        enableRotate={false}
        enablePan={true}
        enableZoom={true}
        minZoom={8}
        maxZoom={50}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 0 }}
      />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-10, 20, -10]} intensity={0.3} />
      <ExpoHall />
    </Canvas>
  );
}
