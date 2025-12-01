import { create } from "zustand";

export type Tool = "select" | "wire" | "delete" | "multimeter";
export type ComponentType = string;

interface UIStore {
  tool: Tool;
  selectedComponentId: string | null;
  selectedConnectionPointId: string | null;
  gridVisible: boolean;
  wireMode: boolean;

  multimeterPointA: string | null;
  multimeterPointB: string | null;

  // Actions
  setTool: (tool: Tool) => void;
  selectComponent: (id: string | null) => void;
  selectConnectionPoint: (id: string | null) => void;
  toggleGrid: () => void;
  setWireMode: (enabled: boolean) => void;
  clearSelection: () => void;

  setMultimeterPointA: (pointId: string | null) => void;
  setMultimeterPointB: (pointId: string | null) => void;
  clearMultimeter: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  tool: "select",
  selectedComponentId: null,
  selectedConnectionPointId: null,
  gridVisible: true,
  wireMode: false,

  multimeterPointA: null,
  multimeterPointB: null,

  setTool: (tool) => {
    set({ tool, wireMode: tool === "wire" });
    if (tool !== "wire") {
      set({ selectedConnectionPointId: null });
    }
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id, selectedConnectionPointId: null });
  },

  selectConnectionPoint: (id) => {
    set({ selectedConnectionPointId: id });
  },

  toggleGrid: () => {
    set((state) => ({ gridVisible: !state.gridVisible }));
  },

  setWireMode: (enabled) => {
    set({ wireMode: enabled });
    if (!enabled) {
      set({ selectedConnectionPointId: null });
    }
  },

  clearSelection: () => {
    set({ selectedComponentId: null, selectedConnectionPointId: null });
  },

  setMultimeterPointA: (pointId) => set({ multimeterPointA: pointId }),
  setMultimeterPointB: (pointId) => set({ multimeterPointB: pointId }),
  clearMultimeter: () =>
    set({ multimeterPointA: null, multimeterPointB: null }),
}));
