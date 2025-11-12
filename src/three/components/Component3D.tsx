import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { type CircuitComponent3D } from "../../@types/circuit.types";
import { getComponentMetadata } from "../../lib/component-registry";
import { ConnectionPoint3D } from "../connection/ConnectionPoint";
import { DragControls } from "../interaction/DragControls";
import { SelectionBox } from "../interaction/SelectionBox";
import { useComponentSelection } from "../../hooks/useComponentSelection";
import { useWireMode } from "../../hooks/useWireMode";
import { Resistor3D } from "./Resistor3D";
import { Capacitor3D } from "./Capacitor3D";
import { LED3D } from "./LED3D";
import { VoltageSource3D } from "./VoltageSource3D";
import { Diode3D } from "./Diode3D";
import { Switch3D } from "./Switch3D";

interface Component3DProps {
  component: CircuitComponent3D;
}

const COMPONENT_3D_MAP: Record<string, React.ComponentType<{ component: CircuitComponent3D }>> = {
  resistor: Resistor3D,
  capacitor: Capacitor3D,
  led: LED3D,
  voltageSource: VoltageSource3D,
  diode: Diode3D,
  switch: Switch3D,
};

export function Component3D({ component }: Component3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { selectedComponentId, selectComponent } = useComponentSelection();
  const { wireMode, selectedConnectionPointId, handleConnectionPointClick } = useWireMode();
  const isSelected = selectedComponentId === component.id;

  // Update position and rotation
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...component.position);
    groupRef.current.rotation.set(...component.rotation);
  });

  const SpecificComponent = COMPONENT_3D_MAP[component.type] || DefaultComponent3D;

  const handleComponentClick = (e: any) => {
    if (!wireMode) {
      e.stopPropagation();
      selectComponent(component.id);
    }
  };

  return (
    <group ref={groupRef}>
      <DragControls component={component} enabled={!wireMode}>
        <group onClick={handleComponentClick}>
          <SpecificComponent component={component} />
          <SelectionBox visible={isSelected} />
        </group>
      </DragControls>

      {component.connectionPoints.map((cp) => (
        <ConnectionPoint3D
          key={cp.id}
          connectionPoint={cp}
          componentPosition={component.position}
          isSelected={selectedConnectionPointId === cp.id}
          onClick={() => handleConnectionPointClick(cp)}
        />
      ))}
    </group>
  );
}

// Default component renderer
function DefaultComponent3D({ component }: Component3DProps) {
  const metadata = getComponentMetadata(component.type as any);
  const geometry = metadata.geometry;

  if (!geometry) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={metadata.color} />
      </mesh>
    );
  }

  let geom: React.ReactNode;
  switch (geometry.type) {
    case "box":
      geom = <boxGeometry args={geometry.args as [number, number, number]} />;
      break;
    case "cylinder":
      geom = <cylinderGeometry args={geometry.args as [number, number, number, number]} />;
      break;
    case "sphere":
      geom = <sphereGeometry args={geometry.args as [number, number, number]} />;
      break;
    default:
      geom = <boxGeometry args={[1, 1, 1]} />;
  }

  return (
    <mesh castShadow receiveShadow>
      {geom}
      <meshStandardMaterial color={metadata.color} />
    </mesh>
  );
}

