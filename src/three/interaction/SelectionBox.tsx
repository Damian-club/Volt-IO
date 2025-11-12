import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SelectionBoxProps {
  visible: boolean;
}

export function SelectionBox({ visible }: SelectionBoxProps) {
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.visible = visible;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={boxRef} visible={visible}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}

