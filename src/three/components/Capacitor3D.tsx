import { type CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";

export function Capacitor3D({ component }: { component: CircuitComponent3D }) {
  const metadata = getComponentMetadata("capacitor");

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[0.3, 1.0, 0.4]} />
      <meshStandardMaterial color={metadata.color} />
    </mesh>
  );
}

