import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
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
  isSelected,
  onClick,
}: ConnectionPoint3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { wireMode, selectedConnectionPointId } = useWireMode();
  const [isHovered, setIsHovered] = useState(false);

  const localPosition = new THREE.Vector3(
    connectionPoint.localPosition.x,
    connectionPoint.localPosition.y,
    connectionPoint.localPosition.z
  );

  const getColor = () => {
    if (isSelected) return "#f59e0b"; // Orange cuando está seleccionado
    if (wireMode && isHovered) return "#fbbf24"; // Yellow cuando hover en wire mode
    if (wireMode) return "#22c55e"; // Green en wire mode
    if (isHovered) return "#fbbf24"; // Yellow on hover
    return "#ef4444"; // Red por defecto
  };

  const getSize = () => {
    if (isSelected) return 0.2;
    if (isHovered) return 0.18;
    return 0.15;
  };

  const color = getColor();
  const size = getSize();

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log("Connection point clicked:", connectionPoint.id);
    onClick();
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={localPosition}
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          if (wireMode) {
            document.body.style.cursor = "crosshair";
          } else {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.8 : 0.4}
        />
        
        {/* Efecto de anillo cuando está en wire mode */}
        {wireMode && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.6, 32]} />
            <meshBasicMaterial 
              color={isSelected ? "#f59e0b" : "#22c55e"}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </mesh>

      {/* Labels SOLO informativos - con pointerEvents: 'none' */}
      {wireMode && isHovered && (
        <Html 
          position={[localPosition.x, localPosition.y + 0.3, localPosition.z]} 
          center 
          style={{ pointerEvents: 'none' }} // ← CRÍTICO: No intercepta clics
        >
          <div className="bg-slate-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {isSelected ? "Seleccionado" : "Clic para conectar"}
          </div>
        </Html>
      )}

      {wireMode && selectedConnectionPointId && !isSelected && isHovered && (
        <Html 
          position={[localPosition.x, localPosition.y + 0.3, localPosition.z]} 
          center 
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            ✓ Conectar aquí
          </div>
        </Html>
      )}
    </group>
  );
}