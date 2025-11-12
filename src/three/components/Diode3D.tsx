import { type CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";

export function Diode3D({ component }: { component: CircuitComponent3D }) {
  const metadata = getComponentMetadata("diode");

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.3, 0.3]} />
      <meshStandardMaterial color={metadata.color} />
    </mesh>
  );
}

