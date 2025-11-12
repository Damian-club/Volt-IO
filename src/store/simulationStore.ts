import { create } from "zustand";
import Simulator from "../@core/Simulator";
import { type SimulationState } from "../@types/circuit.types";

interface SimulationStore {
  simulator: Simulator | null;
  state: SimulationState;
  isInitialized: boolean;
  
  // Actions
  initialize: (simulator: Simulator) => void;
  start: (dt?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  step: (dt: number, steps: number) => void;
  updateState: (updates: Partial<SimulationState>) => void;
}

const defaultState: SimulationState = {
  isRunning: false,
  isPaused: false,
  currentTime: 0,
  dt: 1e-6,
  step: 0,
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  simulator: null,
  state: defaultState,
  isInitialized: false,

  initialize: (simulator) => {
    set({ simulator, isInitialized: true });
  },

  start: (dt = 1e-6) => {
    const { simulator, state } = get();
    if (!simulator || state.isRunning) return;

    set({
      state: {
        ...state,
        isRunning: true,
        isPaused: false,
        dt,
      },
    });
  },

  pause: () => {
    set((state) => ({
      state: {
        ...state.state,
        isPaused: true,
      },
    }));
  },

  resume: () => {
    set((state) => ({
      state: {
        ...state.state,
        isPaused: false,
      },
    }));
  },

  stop: () => {
    set({
      state: defaultState,
    });
  },

  step: (dt, steps) => {
    const { simulator, state } = get();
    if (!simulator || !state.isRunning || state.isPaused) return;

    simulator.runTransient(dt, steps);
    
    set((prev) => ({
      state: {
        ...prev.state,
        currentTime: prev.state.currentTime + dt * steps,
        step: prev.state.step + steps,
      },
    }));
  },

  updateState: (updates) => {
    set((state) => ({
      state: {
        ...state.state,
        ...updates,
      },
    }));
  },
}));

