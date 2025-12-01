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

export function DragControls({
  component,
  enabled = true,
  children,
}: DragControlsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<THREE.Vector3 | null>(null);

  const { camera, gl } = useThree();
  const { moveComponent } = useCircuitState();
  const { tool } = useUIStore();

  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());

  // Handle pointer move during drag
  useEffect(() => {
    if (!isDragging || !enabled || tool !== "select" || !dragStart) return;

    console.log("Drag active for:", component.id);

    const handlePointerMove = (event: PointerEvent) => {
      if (!groupRef.current) return;

      // Calculate normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const pointer = new THREE.Vector2(x, y);

      // Raycast to plane
      raycaster.current.setFromCamera(pointer, camera);
      const intersection = new THREE.Vector3();
      const hit = raycaster.current.ray.intersectPlane(
        plane.current,
        intersection
      );

      if (hit) {
        // Calculate new position with snap to grid
        const snappedX = Math.round(intersection.x * 2) / 2; // Snap to 0.5
        const snappedZ = Math.round(intersection.z * 2) / 2; // Snap to 0.5

        const newPosition: [number, number, number] = [
          snappedX,
          component.position[1], // Keep Y the same
          snappedZ,
        ];

        console.log("Moving to:", newPosition);
        moveComponent(component.id, newPosition);
      }
    };

    const handlePointerUp = () => {
      console.log("Drag ended for:", component.id);
      setIsDragging(false);
      setDragStart(null);
      gl.domElement.style.cursor = "grab";
    };

    // Set cursor
    gl.domElement.style.cursor = "grabbing";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      gl.domElement.style.cursor = "default";
    };
  }, [
    isDragging,
    enabled,
    tool,
    dragStart,
    gl,
    camera,
    component.id,
    component.position,
    moveComponent,
  ]);

  const handlePointerDown = (e: any) => {
    console.log("Pointer down on:", component.id);
    console.log("Enabled:", enabled);
    console.log("Tool:", tool);

    if (!enabled || tool !== "select") {
      console.log("Drag cancelled - conditions not met");
      return;
    }

    e.stopPropagation();

    // Calculate intersection point
    raycaster.current.setFromCamera(e.pointer, camera);

    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane.current, intersection);

    console.log("Drag started at:", intersection);
    setDragStart(intersection);
    setIsDragging(true);
  };

  const handlePointerOver = () => {
    if (enabled && tool === "select" && !isDragging) {
      gl.domElement.style.cursor = "grab";
    }
  };

  const handlePointerOut = () => {
    if (!isDragging) {
      gl.domElement.style.cursor = "default";
    }
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </group>
  );
}
