import { useRef, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useUIStore } from "../store/uiStore";
import { type CircuitComponent3D } from "../@types/circuit.types";

interface Component3DProps {
  component: CircuitComponent3D;
  onMove?: (id: string, position: [number, number, number]) => void;
  onRotate?: (id: string, rotation: [number, number, number]) => void;
}

export function Component3D({ component, onMove, onRotate }: Component3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPlanePoint, setDragPlanePoint] = useState<THREE.Vector3 | null>(null);
  
  const { tool, selectedComponentId, selectComponent } = useUIStore();
  const isSelected = selectedComponentId === component.id;

  // Handle click to select
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (tool === "select") {
      selectComponent(component.id);
    }
  };

  // Handle drag start
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (tool !== "select" || !isSelected) return;
    
    e.stopPropagation();
    setIsDragging(true);
    
    // Calculate intersection point on grid plane (y=0)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(
      new THREE.Vector2(
        (e.pointer.x * window.innerWidth) / window.innerWidth,
        (e.pointer.y * window.innerHeight) / window.innerHeight
      ),
      e.camera
    );
    
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    setDragPlanePoint(intersection);
  };

  // Handle dragging
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || tool !== "select" || !dragPlanePoint) return;
    
    e.stopPropagation();
    
    // Calculate new intersection point
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(e.pointer, e.camera);
    
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    
    if (intersection && onMove) {
      // Calculate offset from initial drag point
      const offset = intersection.clone().sub(dragPlanePoint);
      const currentPos = new THREE.Vector3(...component.position);
      const newPos = currentPos.add(offset);
      
      // Snap to grid (0.5 unit increments)
      const snappedX = Math.round(newPos.x * 2) / 2;
      const snappedZ = Math.round(newPos.z * 2) / 2;
      
      onMove(component.id, [snappedX, component.position[1], snappedZ]);
      setDragPlanePoint(intersection);
    }
  };

  // Handle drag end
  const handlePointerUp = () => {
    setIsDragging(false);
    setDragPlanePoint(null);
  };

  // Quick rotate button handler
  const handleRotate90 = () => {
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
    <group position={component.position} rotation={component.rotation}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        castShadow
        receiveShadow
      >
        {/* Placeholder geometry - reemplaza con tu geometría real */}
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={isSelected ? "#60a5fa" : "#94a3b8"} 
          emissive={isSelected ? "#3b82f6" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.1, 0.6, 0.6)]} />
            <lineBasicMaterial color="#60a5fa" linewidth={2} />
          </lineSegments>

          {/* Rotation button */}
          <Html position={[0, 0.8, 0]} center>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRotate90();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow-lg transition-colors"
              style={{ pointerEvents: 'auto' }}
            >
              ↻ Rotar 90°
            </button>
          </Html>
        </>
      )}

      {/* Component label */}
      <Html position={[0, -0.5, 0]} center>
        <div className="bg-slate-800/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg">
          {component.type}
        </div>
      </Html>

      {/* Connection points visualization */}
      {component.connectionPoints.map((cp, idx) => (
        <mesh
          key={cp.id}
          position={cp.localPosition}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}