import { type CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";

export function Resistor3D({ component }: { component: CircuitComponent3D }) {
  const metadata = getComponentMetadata("resistor");

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.4, 0.4]} />
      <meshStandardMaterial color={metadata.color} />
    </mesh>
  );
}

