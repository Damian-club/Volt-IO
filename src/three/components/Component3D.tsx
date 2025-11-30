import { useRef } from "react";
import { Html } from "@react-three/drei";
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
  onMove?: (id: string, position: [number, number, number]) => void;
  onRotate?: (id: string, rotation: [number, number, number]) => void;
}

const COMPONENT_3D_MAP: Record<
  string,
  React.ComponentType<{ component: CircuitComponent3D }>
> = {
  resistor: Resistor3D,
  capacitor: Capacitor3D,
  led: LED3D,
  voltageSource: VoltageSource3D,
  diode: Diode3D,
  switch: Switch3D,
};

export function Component3D({ component, onMove, onRotate }: Component3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { selectedComponentId, selectComponent } = useComponentSelection();
  const { wireMode, selectedConnectionPointId, handleConnectionPointClick } =
    useWireMode();
  const isSelected = selectedComponentId === component.id;

  // CRÍTICO: NO usar useFrame para actualizar posición/rotación
  // Dejamos que React lo maneje vía props

  const SpecificComponent =
    COMPONENT_3D_MAP[component.type] || DefaultComponent3D;

  const handleComponentClick = (e: any) => {
    if (!wireMode) {
      e.stopPropagation();
      selectComponent(component.id);
    }
  };

  // Handle rotation - Rotate 90° on Y axis
  const handleRotate90 = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onRotate) {
      const newRotation: [number, number, number] = [
        component.rotation[0],
        component.rotation[1] + Math.PI / 2,
        component.rotation[2]
      ];
      onRotate(component.id, newRotation);
    }
  };

  return (
    <group 
      ref={groupRef}
      position={component.position}
      rotation={component.rotation}
    >
      <DragControls component={component} enabled={!wireMode}>
        <group onClick={handleComponentClick}>
          <SpecificComponent component={component} />
          <SelectionBox visible={isSelected} />
          
          {/* Rotation button when selected */}
          {isSelected && onRotate && (
            <Html position={[0, 1, 0]} center distanceFactor={10}>
              <button
                onClick={handleRotate90}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow-lg transition-colors whitespace-nowrap"
                style={{ pointerEvents: 'auto' }}
              >
                ↻ Rotar 90°
              </button>
            </Html>
          )}
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
function DefaultComponent3D({ component }: { component: CircuitComponent3D }) {
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
      geom = (
        <cylinderGeometry
          args={geometry.args as [number, number, number, number]}
        />
      );
      break;
    case "sphere":
      geom = (
        <sphereGeometry args={geometry.args as [number, number, number]} />
      );
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