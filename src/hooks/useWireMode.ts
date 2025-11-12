import { useCallback } from "react";
import { useUIStore } from "../store/uiStore";
import { useCircuitStore } from "../store/circuitStore";
import { type ConnectionPoint } from "../@types/circuit.types";

export function useWireMode() {
  const {
    wireMode,
    selectedConnectionPointId,
    setWireMode,
    selectConnectionPoint,
  } = useUIStore();

  const { connectNodes, getComponent } = useCircuitStore();

  const handleConnectionPointClick = useCallback(
    (connectionPoint: ConnectionPoint) => {
      if (!wireMode) {
        setWireMode(true);
        selectConnectionPoint(connectionPoint.id);
        return;
      }

      if (!selectedConnectionPointId) {
        selectConnectionPoint(connectionPoint.id);
        return;
      }

      // Connect the two points
      const fromComp = getComponent(connectionPoint.componentId);
      if (!fromComp) return;

      const fromPoint = fromComp.connectionPoints.find(
        (cp) => cp.id === selectedConnectionPointId
      );
      if (!fromPoint) return;

      // Don't connect to the same point or same component
      if (
        fromPoint.id === connectionPoint.id ||
        fromPoint.componentId === connectionPoint.componentId
      ) {
        selectConnectionPoint(null);
        return;
      }

      connectNodes(fromPoint, connectionPoint);
      selectConnectionPoint(null);
    },
    [
      wireMode,
      selectedConnectionPointId,
      setWireMode,
      selectConnectionPoint,
      connectNodes,
      getComponent,
    ]
  );

  return {
    wireMode,
    selectedConnectionPointId,
    setWireMode,
    handleConnectionPointClick,
  };
}

