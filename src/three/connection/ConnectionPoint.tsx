import { useRef, useMemo } from "react";
import * as THREE from "three";
import { type ConnectionPoint as ConnectionPointType } from "../../@types/circuit.types";
import { useWireMode } from "../../hooks/useWireMode";

interface ConnectionPoint3DProps {
  connectionPoint: ConnectionPointType;
  componentPosition: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export function ConnectionPoint3D({
  connectionPoint,
  componentPosition,
  isSelected,
  onClick,
}: ConnectionPoint3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { wireMode, selectedConnectionPointId } = useWireMode();
  const isHovered = false; // Could be managed with state

  // Calculate world position directly
  const worldPosition = useMemo(() => {
    const localPos = new THREE.Vector3(
      connectionPoint.localPosition.x,
      connectionPoint.localPosition.y,
      connectionPoint.localPosition.z
    );
    const compPos = new THREE.Vector3(...componentPosition);
    return localPos.add(compPos);
  }, [connectionPoint.localPosition, componentPosition]);

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
      position={worldPosition}
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

