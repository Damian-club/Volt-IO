import { create } from "zustand";
import {
  type CircuitComponent3D,
  type WireConnection,
  type ConnectionPoint,
} from "../@types/circuit.types";

interface CircuitStore {
  components: Map<string, CircuitComponent3D>;
  wires: Map<string, WireConnection>;

  // Actions
  addComponent: (component: CircuitComponent3D) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<CircuitComponent3D>) => void;
  getComponent: (id: string) => CircuitComponent3D | undefined;

  addWire: (wire: WireConnection) => void;
  removeWire: (id: string) => void;
  getWiresForConnectionPoint: (connectionPointId: string) => WireConnection[];

  connectNodes: (from: ConnectionPoint, to: ConnectionPoint) => void;
  disconnectNodes: (connectionPointId: string) => void;

  clear: () => void;
}

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  components: new Map(),
  wires: new Map(),

  addComponent: (component) => {
    set((state) => {
      const newComponents = new Map(state.components);
      newComponents.set(component.id, component);
      return { components: newComponents };
    });
  },

  removeComponent: (id) => {
    set((state) => {
      const component = state.components.get(id);
      if (!component) return state;

      // Remove all wires connected to this component's connection points
      const newWires = new Map(state.wires);
      component.connectionPoints.forEach((cp) => {
        const wires = get().getWiresForConnectionPoint(cp.id);
        wires.forEach((wire) => newWires.delete(wire.id));
      });

      const newComponents = new Map(state.components);
      newComponents.delete(id);

      return { components: newComponents, wires: newWires };
    });
  },

  updateComponent: (id, updates) => {
    set((state) => {
      const component = state.components.get(id);
      if (!component) {
        console.warn("Component not found in store:", id);
        return state;
      }

      // CRÍTICO: Crear un NUEVO objeto para que React detecte el cambio
      const updated = { ...component, ...updates };

      // CRÍTICO: Crear un NUEVO Map para que Zustand detecte el cambio
      const newComponents = new Map(state.components);
      newComponents.set(id, updated);

      console.log("Store updated - Component:", id);
      console.log("New position:", updated.position);
      console.log("New rotation:", updated.rotation);

      return { components: newComponents };
    });
  },

  getComponent: (id) => {
    const state = get();
    return state.components.get(id);
  },

  addWire: (wire) => {
    set((state) => {
      const newWires = new Map(state.wires);
      newWires.set(wire.id, wire);
      return { wires: newWires };
    });
  },

  removeWire: (id) => {
    set((state) => {
      const newWires = new Map(state.wires);
      newWires.delete(id);
      return { wires: newWires };
    });
  },

  getWiresForConnectionPoint: (connectionPointId) => {
    const wires = Array.from(get().wires.values());
    return wires.filter(
      (w) => w.from === connectionPointId || w.to === connectionPointId
    );
  },

  connectNodes: (from, to) => {
    console.log("Store: conectando nodos", from.id, to.id);
    // Merge nodes in the simulation
    from.node.mergeWith(to.node);

    // Create wire connection
    const wireId = `wire-${from.id}-${to.id}`;
    const wire: WireConnection = {
      id: wireId,
      from: from.id,
      to: to.id,
    };
    console.log("Wire creado:", wire);
    get().addWire(wire);
  },

  disconnectNodes: (connectionPointId) => {
    const wires = get().getWiresForConnectionPoint(connectionPointId);
    wires.forEach((wire) => get().removeWire(wire.id));
  },

  clear: () => {
    set({ components: new Map(), wires: new Map() });
  },
}));
