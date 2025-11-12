import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { type  CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";
import Switch from "../../@core/components/Switch";

export function Switch3D({ component }: { component: CircuitComponent3D }) {
  const metadata = getComponentMetadata("switch");
  const meshRef = useRef<THREE.Mesh>(null);
  const switchComponent = component.component as Switch;

  useFrame(() => {
    if (!meshRef.current || !switchComponent) return;

    // Access private _closed property via type assertion
    const isClosed = (switchComponent as any)._closed;
    const rotation = isClosed ? Math.PI / 4 : 0;

    if (meshRef.current) {
      meshRef.current.rotation.z = rotation;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.2, 0.2]} />
      <meshStandardMaterial color={metadata.color} />
    </mesh>
  );
}

