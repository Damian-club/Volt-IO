import { useCallback, useMemo } from "react";
import { useCircuitStore } from "../store/circuitStore";
import { type CircuitComponent3D, type ConnectionPoint } from "../@types/circuit.types";
import { type ComponentType } from "../@types/component-metadata.types";
import { createComponent, getComponentMetadata } from "../lib/component-registry";
import Node from "../@core/nodes/Node";
import * as THREE from "three";

export function useCircuitState() {
  // Get stable references to actions (they don't change)
  const addComponent = useCircuitStore((state) => state.addComponent);
  const removeComponent = useCircuitStore((state) => state.removeComponent);
  const updateComponent = useCircuitStore((state) => state.updateComponent);
  const getComponent = useCircuitStore((state) => state.getComponent);
  const connectNodes = useCircuitStore((state) => state.connectNodes);
  const disconnectNodes = useCircuitStore((state) => state.disconnectNodes);
  const clear = useCircuitStore((state) => state.clear);

  // CRÍTICO: Suscribirse directamente al Map para que React detecte cambios
  const componentsMap = useCircuitStore((state) => state.components);
  const wiresMap = useCircuitStore((state) => state.wires);

  // Convertir a arrays (se actualizará cuando el Map cambie)
  const components = useMemo(() => {
    return Array.from(componentsMap.values());
  }, [componentsMap]);

  const wires = useMemo(() => {
    return Array.from(wiresMap.values());
  }, [wiresMap]);

  const createAndAddComponent = useCallback(
    (
      type: ComponentType,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      properties: Record<string, any> = {}
    ): string => {
      const id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const metadata = getComponentMetadata(type as ComponentType);
      
      // Create nodes for connection points
      const nodes: Node[] = metadata.connectionPoints.map(() => new Node());
      
      // Create the simulation component
      const component = createComponent(
        type as ComponentType,
        `${type}_${id}`,
        nodes,
        { ...metadata.defaultProperties, ...properties }
      );

      // Create connection points
      const connectionPoints: ConnectionPoint[] = metadata.connectionPoints.map(
        (cp, idx) => ({
          id: `${id}-cp-${idx}`,
          localPosition: new THREE.Vector3(...cp.localPosition),
          node: nodes[idx],
          componentId: id,
        })
      );

      const circuitComponent: CircuitComponent3D = {
        id,
        type,
        position,
        rotation,
        component,
        connectionPoints,
        properties: { ...metadata.defaultProperties, ...properties },
      };

      addComponent(circuitComponent);
      return id;
    },
    [addComponent]
  );

  const moveComponent = useCallback(
    (id: string, position: [number, number, number]) => {
      console.log("moveComponent called:", id, position);
      const comp = getComponent(id);
      if (comp) {
        console.log("Component found, updating position");
        updateComponent(id, { position });
      } else {
        console.warn("Component not found:", id);
      }
    },
    [updateComponent, getComponent]
  );

  const rotateComponent = useCallback(
    (id: string, rotation: [number, number, number]) => {
      console.log("rotateComponent called:", id, rotation);
      updateComponent(id, { rotation });
    },
    [updateComponent]
  );

  const updateComponentProperties = useCallback(
    (id: string, properties: Record<string, any>) => {
      const comp = getComponent(id);
      if (!comp) return;

      // Update simulation component if needed
      // For now, we'll recreate it with new properties
      const newComponent = createComponent(
        comp.type as ComponentType,
        comp.component.name,
        comp.component.nodeArray,
        { ...comp.properties, ...properties }
      );

      updateComponent(id, {
        properties: { ...comp.properties, ...properties },
        component: newComponent,
      });
    },
    [getComponent, updateComponent]
  );

  const connectConnectionPoints = useCallback(
    (from: ConnectionPoint, to: ConnectionPoint) => {
      connectNodes(from, to);
    },
    [connectNodes]
  );

  return {
    components,
    wires,
    createAndAddComponent,
    removeComponent,
    moveComponent,
    rotateComponent,
    updateComponentProperties,
    connectConnectionPoints,
    disconnectNodes,
    getComponent,
    clear,
  };
}