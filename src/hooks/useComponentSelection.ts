import { useUIStore } from "../store/uiStore";
import { useCircuitStore } from "../store/circuitStore";

export function useComponentSelection() {
  const {
    selectedComponentId,
    selectComponent,
    clearSelection,
  } = useUIStore();

  const { getComponent } = useCircuitStore();

  const selectedComponent = selectedComponentId
    ? getComponent(selectedComponentId)
    : null;

  return {
    selectedComponentId,
    selectedComponent,
    selectComponent,
    clearSelection,
  };
}

