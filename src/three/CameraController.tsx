import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  return (
    <OrbitControls
      ref={controlsRef}
      camera={camera}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={5}
      maxDistance={50}
    />
  );
}

