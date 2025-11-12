import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { type CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";
import LED from "../../@core/components/LED";

export function LED3D({ component }: { component: CircuitComponent3D }) {
  const metadata = getComponentMetadata("led");
  const meshRef = useRef<THREE.Mesh>(null);
  const ledComponent = component.component as LED;

  useFrame(() => {
    if (!meshRef.current || !ledComponent) return;

    const isLit = ledComponent.isLit;
    const intensity = isLit ? 1.0 : 0.1;
    const color = isLit ? "#ff0000" : "#330000";

    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.set(color);
      meshRef.current.material.emissive.set(color);
      meshRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
      <meshStandardMaterial
        color={metadata.color}
        emissive="#ff0000"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

