import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWireMode } from "../../hooks/useWireMode";
import { useCircuitStore } from "../../store/circuitStore";

export function WirePreview() {
  const { wireMode, selectedConnectionPointId } = useWireMode();
  const { components } = useCircuitStore();
  const { camera, raycaster, pointer } = useThree();
  
  const lineRef = useRef<THREE.Line>(null);
  const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null);
  const [endPoint, setEndPoint] = useState<THREE.Vector3 | null>(null);

  // Find the selected connection point's world position
  useEffect(() => {
    if (!wireMode || !selectedConnectionPointId) {
      setStartPoint(null);
      setEndPoint(null);
      return;
    }

    // Find the component that has this connection point
    for (const component of Array.from(components.values())) {
      const cp = component.connectionPoints.find(p => p.id === selectedConnectionPointId);
      if (cp) {
        // Calculate world position
        const componentPos = new THREE.Vector3(...component.position);
        const localPos = new THREE.Vector3(
          cp.localPosition.x,
          cp.localPosition.y,
          cp.localPosition.z
        );
        
        // Apply component rotation
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationFromEuler(
          new THREE.Euler(...component.rotation)
        );
        localPos.applyMatrix4(rotationMatrix);
        
        const worldPos = componentPos.add(localPos);
        setStartPoint(worldPos);
        break;
      }
    }
  }, [wireMode, selectedConnectionPointId, components]);

  // Update end point based on mouse position
  useFrame(() => {
    if (!wireMode || !selectedConnectionPointId || !startPoint) {
      return;
    }

    // Raycast to grid plane (y = 0)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    raycaster.setFromCamera(pointer, camera);
    
    const intersection = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(plane, intersection);
    
    if (hit) {
      setEndPoint(intersection);
    }
  });

  // Don't render if not in wire mode or no start point
  if (!wireMode || !selectedConnectionPointId || !startPoint || !endPoint) {
    return null;
  }

  // Create line geometry
  const points = [startPoint, endPoint];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Usar primitive en lugar de line para evitar errores de tipos
  return (
    <primitive 
      object={new THREE.Line(
        geometry, 
        new THREE.LineBasicMaterial({ 
          color: "#fbbf24", 
          linewidth: 2,
          transparent: true,
          opacity: 0.8
        })
      )} 
    />
  );
}