import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { type CircuitComponent3D } from "../../@types/circuit.types";
import { useCircuitState } from "../../hooks/useCircuitState";
import { useUIStore } from "../../store/uiStore";

interface DragControlsProps {
  component: CircuitComponent3D;
  enabled?: boolean;
  children: React.ReactNode;
}

export function DragControls({ component, enabled = true, children }: DragControlsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();
  const { moveComponent } = useCircuitState();
  const { tool } = useUIStore();

  const [plane] = useState(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [offset] = useState(() => new THREE.Vector3());

  useEffect(() => {
    if (!isDragging || !enabled || tool !== "select") return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!groupRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const intersection = new THREE.Vector3();
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      const newPos = intersection.sub(offset);

      const newPosition: [number, number, number] = [
        newPos.x,
        newPos.y,
        newPos.z,
      ];

      moveComponent(component.id, newPosition);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, enabled, tool, gl, camera, plane, raycaster, offset, component.id, moveComponent]);

  const handlePointerDown = (e: any) => {
    if (!enabled || tool !== "select") return;
    e.stopPropagation();
    setIsDragging(true);

    if (!groupRef.current) return;

    const intersection = new THREE.Vector3();
    raycaster.setFromCamera(e.pointer, camera);
    raycaster.ray.intersectPlane(plane, intersection);
    offset.copy(intersection).sub(new THREE.Vector3(...component.position));
  };

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      {children}
    </group>
  );
}

