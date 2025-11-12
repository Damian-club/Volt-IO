import  Component  from "@/@core/components/Component";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface BaseComponent3DProps {
  component: Component;
  color?: string;
  onClick?: () => void;
}

export function BaseComponent3D({ component, color = "gray", onClick }: BaseComponent3DProps) {
  const ref = useRef<THREE.Mesh>(null);

  // Example: color intensity = voltage difference
  useFrame(() => {
    if (!ref.current) return;
    const voltage =
      component.nodeArray[0]?.voltage ?? 0 -
      (component.nodeArray[1]?.voltage ?? 0);

    //ref.current.material.color.setHSL(0.6 - voltage * 0.1, 1, 0.5);
  });

  return (
    <mesh ref={ref} onClick={onClick}>
      <boxGeometry args={[0.5, 0.2, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
