import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { type ConnectionPoint as ConnectionPointType } from "../../@types/circuit.types";
import { useWireMode } from "../../hooks/useWireMode";
import { useUIStore } from "../../store/uiStore";

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
  const { 
    tool, 
    multimeterPointA, 
    multimeterPointB, 
    setMultimeterPointA, 
    setMultimeterPointB 
  } = useUIStore();
  
  const [isHovered, setIsHovered] = useState(false);

  const isMultimeterMode = tool === "multimeter";

  const localPosition = new THREE.Vector3(
    connectionPoint.localPosition.x,
    connectionPoint.localPosition.y,
    connectionPoint.localPosition.z
  );

  const getColor = () => {
    // En modo multímetro, cambiar colores
    if (isMultimeterMode) {
      if (connectionPoint.id === multimeterPointA || connectionPoint.id === multimeterPointB) {
        return "#8b5cf6"; // Morado para puntos seleccionados en multímetro
      }
      if (isHovered) return "#a78bfa"; // Morado claro al hacer hover
      return "#c4b5fd"; // Morado muy claro por defecto
    }
    
    // Colores normales para otros modos
    if (isSelected) return "#f59e0b";
    if (wireMode && isHovered) return "#fbbf24";
    if (wireMode) return "#22c55e";
    if (isHovered) return "#fbbf24";
    return "#ef4444";
  };

  const getSize = () => {
    if (isMultimeterMode) {
      if (connectionPoint.id === multimeterPointA || connectionPoint.id === multimeterPointB) {
        return 0.22; // Más grande cuando está seleccionado en multímetro
      }
      return 0.18; // Tamaño normal en multímetro
    }
    
    if (isSelected) return 0.2;
    if (isHovered) return 0.18;
    return 0.15;
  };

  const color = getColor();
  const size = getSize();

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Si estamos en modo multímetro
    if (isMultimeterMode) {
      console.log("📊 Multímetro - Click en punto:", connectionPoint.id);
      
      if (!multimeterPointA) {
        setMultimeterPointA(connectionPoint.id);
      } else if (!multimeterPointB && connectionPoint.id !== multimeterPointA) {
        setMultimeterPointB(connectionPoint.id);
      } else {
        // Si ya hay dos puntos, reinicia con este como A
        setMultimeterPointA(connectionPoint.id);
        setMultimeterPointB(null);
      }
      return;
    }
    
    // Comportamiento normal para wire mode
    onClick();
  };

  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    
    if (isMultimeterMode) {
      document.body.style.cursor = "crosshair";
    } else if (wireMode) {
      document.body.style.cursor = "crosshair";
    } else {
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={localPosition}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.8 : 0.4}
        />
        
        {/* Anillo para wire mode Y multímetro */}
        {(wireMode || isMultimeterMode) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.6, 32]} />
            <meshBasicMaterial 
              color={isMultimeterMode ? "#8b5cf6" : (isSelected ? "#f59e0b" : "#22c55e")}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </mesh>

      {/* Labels para wire mode */}
      {wireMode && isHovered && (
        <Html 
          position={[localPosition.x, localPosition.y + 0.3, localPosition.z]} 
          center 
          style={{ pointerEvents: 'none' }}
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

      {/* Labels para multímetro */}
      {isMultimeterMode && isHovered && (
        <Html 
          position={[localPosition.x, localPosition.y + 0.3, localPosition.z]} 
          center 
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-purple-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {connectionPoint.id === multimeterPointA && "Punto A ✓"}
            {connectionPoint.id === multimeterPointB && "Punto B ✓"}
            {!multimeterPointA && "Clic para Punto A"}
            {multimeterPointA && !multimeterPointB && connectionPoint.id !== multimeterPointA && "Clic para Punto B"}
            {multimeterPointA && multimeterPointB && "Clic para reiniciar"}
          </div>
        </Html>
      )}
    </group>
  );
}