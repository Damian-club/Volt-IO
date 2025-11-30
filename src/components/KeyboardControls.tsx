import { useEffect } from "react";
import { useCircuitState } from "../hooks/useCircuitState";
import { useComponentSelection } from "../hooks/useComponentSelection";

/**
 * Component to handle keyboard shortcuts for component manipulation
 */
export function KeyboardControls() {
  const { rotateComponent, getComponent, removeComponent } = useCircuitState();
  const { selectedComponentId, selectComponent } = useComponentSelection();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!selectedComponentId) return;

      const component = getComponent(selectedComponentId);
      if (!component) return;

      // R key - Rotate 90° on Y axis
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        const direction = e.shiftKey ? -1 : 1;
        const newRotation: [number, number, number] = [
          component.rotation[0],
          component.rotation[1] + (Math.PI / 2) * direction,
          component.rotation[2]
        ];
        rotateComponent(selectedComponentId, newRotation);
      }

      // X key - Rotate 90° on X axis
      if (e.key === "x" || e.key === "X") {
        e.preventDefault();
        const direction = e.shiftKey ? -1 : 1;
        const newRotation: [number, number, number] = [
          component.rotation[0] + (Math.PI / 2) * direction,
          component.rotation[1],
          component.rotation[2]
        ];
        rotateComponent(selectedComponentId, newRotation);
      }

      // Z key - Rotate 90° on Z axis
      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        const direction = e.shiftKey ? -1 : 1;
        const newRotation: [number, number, number] = [
          component.rotation[0],
          component.rotation[1],
          component.rotation[2] + (Math.PI / 2) * direction
        ];
        rotateComponent(selectedComponentId, newRotation);
      }

      // Delete/Backspace - Delete component
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeComponent(selectedComponentId);
        selectComponent(null);
      }

      // Escape - Deselect
      if (e.key === "Escape") {
        e.preventDefault();
        selectComponent(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    selectedComponentId, 
    rotateComponent, 
    getComponent, 
    removeComponent, 
    selectComponent
  ]);

  return null;
}