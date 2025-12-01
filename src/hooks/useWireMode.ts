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
      console.log("🟡 WireMode - Click en punto:", connectionPoint.id);
      console.log("🟡 WireMode actual:", wireMode);
      console.log("🟡 Punto seleccionado actual:", selectedConnectionPointId);

      if (!wireMode) {
        console.log("🟢 Activando modo wire");
        setWireMode(true);
        selectConnectionPoint(connectionPoint.id);
        return;
      }

      if (!selectedConnectionPointId) {
        console.log("🟡 Seleccionando primer punto");
        selectConnectionPoint(connectionPoint.id);
        return;
      }

      console.log("🔗 Conectando puntos...");


      let fromComp = null;
      let fromPoint = null;

      const allComponents = Array.from(
        useCircuitStore.getState().components.values()
      );
      for (const comp of allComponents) {
        fromPoint = comp.connectionPoints.find(
          (cp) => cp.id === selectedConnectionPointId
        );
        if (fromPoint) {
          fromComp = comp;
          break;
        }
      }

      if (!fromComp || !fromPoint) {
        console.log(
          "❌ No se encontró fromPoint con id:",
          selectedConnectionPointId
        );
        selectConnectionPoint(null);
        return;
      }

      const toPoint = connectionPoint;
      const toComp = getComponent(connectionPoint.componentId);

      if (!toComp) {
        console.log("❌ No se encontró toComponent");
        return;
      }

      if (
        fromPoint.id === toPoint.id ||
        fromPoint.componentId === toPoint.componentId
      ) {
        console.log("⚠️ Mismo punto o componente, cancelando");
        selectConnectionPoint(null);
        return;
      }

      console.log("✅ Conectando:", fromPoint.id, "->", toPoint.id);
      console.log("✅ From component:", fromComp.id);
      console.log("✅ To component:", toComp.id);

      connectNodes(fromPoint, toPoint);
      selectConnectionPoint(null);
      setWireMode(false);
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
