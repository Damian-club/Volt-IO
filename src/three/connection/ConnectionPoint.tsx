import { useRef } from "react";
import * as THREE from "three";
import { type ConnectionPoint as ConnectionPointType } from "../../@types/circuit.types";
import { useWireMode } from "../../hooks/useWireMode";

interface ConnectionPoint3DProps {
  connectionPoint: ConnectionPointType;
  componentPosition: [number, number, number]; // Ya no lo necesitamos
  isSelected: boolean;
  onClick: () => void;
}

export function ConnectionPoint3D({
  connectionPoint,
  isSelected,
  onClick,
}: ConnectionPoint3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { wireMode, selectedConnectionPointId } = useWireMode();
  const isHovered = false; // Could be managed with state

  // CRÍTICO: Solo usar localPosition
  // El parent group ya tiene componentPosition, no debemos sumarla
  const localPosition = new THREE.Vector3(
    connectionPoint.localPosition.x,
    connectionPoint.localPosition.y,
    connectionPoint.localPosition.z
  );

  const getColor = () => {
    if (isSelected) return "#f59e0b";
    if (selectedConnectionPointId && wireMode) return "#fbbf24";
    if (isHovered) return "#fbbf24";
    return "#ef4444";
  };

  const color = getColor();

  return (
    <mesh
      ref={meshRef}
      position={localPosition}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected || isHovered ? 0.5 : 0.3}
      />
    </mesh>
  );
}