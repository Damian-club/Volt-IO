import { type ComponentMetadata } from "./circuit.types";

/**
 * Registry of all component metadata
 */
export type ComponentType = 
  | "resistor"
  | "capacitor"
  | "voltageSource"
  | "led"
  | "diode"
  | "switch"
  | "coil"
  | "transistor_npn"
  | "transistor_mosfet";

export const COMPONENT_METADATA: Record<ComponentType, ComponentMetadata> = {
  resistor: {
    label: "Resistor",
    icon: "⎍",
    color: "#9d4b4b",
    category: "Passive",
    defaultProperties: { value: 1000 }, // Ohms
    connectionPoints: [
      { localPosition: [-0.75, 0, 0], label: "Terminal 1" },
      { localPosition: [0.75, 0, 0], label: "Terminal 2" },
    ],
    geometry: {
      type: "box",
      args: [1.5, 0.4, 0.4],
    },
  },
  capacitor: {
    label: "Capacitor",
    icon: "║",
    color: "#3b5b9d",
    category: "Passive",
    defaultProperties: { value: 1e-6 }, // Farads
    connectionPoints: [
      { localPosition: [0, 0.5, 0], label: "Positive" },
      { localPosition: [0, -0.5, 0], label: "Negative" },
    ],
    geometry: {
      type: "box",
      args: [0.3, 1.0, 0.4],
    },
  },
  voltageSource: {
    label: "Voltage Source",
    icon: "🔋",
    color: "#2f7f4f",
    category: "Power",
    defaultProperties: { Vdc: 5, mode: "DC" },
    connectionPoints: [
      { localPosition: [0, 0.4, 0], label: "Positive" },
      { localPosition: [0, -0.4, 0], label: "Negative" },
    ],
    geometry: {
      type: "box",
      args: [0.6, 0.8, 0.3],
    },
  },
  led: {
    label: "LED",
    icon: "◆",
    color: "#E74C3C",
    category: "Semiconductor",
    defaultProperties: { forwardVoltage: 2.0 },
    connectionPoints: [
      { localPosition: [0, 0.3, 0], label: "Anode" },
      { localPosition: [0, -0.3, 0], label: "Cathode" },
    ],
    geometry: {
      type: "cylinder",
      args: [0.2, 0.2, 0.6, 16],
    },
  },
  diode: {
    label: "Diode",
    icon: "▶",
    color: "#9B59B6",
    category: "Semiconductor",
    defaultProperties: {},
    connectionPoints: [
      { localPosition: [-0.3, 0, 0], label: "Anode" },
      { localPosition: [0.3, 0, 0], label: "Cathode" },
    ],
    geometry: {
      type: "box",
      args: [0.6, 0.3, 0.3],
    },
  },
  switch: {
    label: "Switch",
    icon: "⚡",
    color: "#F39C12",
    category: "Control",
    defaultProperties: { closed: false },
    connectionPoints: [
      { localPosition: [-0.4, 0, 0], label: "Terminal 1" },
      { localPosition: [0.4, 0, 0], label: "Terminal 2" },
    ],
    geometry: {
      type: "box",
      args: [0.8, 0.2, 0.2],
    },
  },
  coil: {
    label: "Inductor",
    icon: "◉",
    color: "#16A085",
    category: "Passive",
    defaultProperties: { value: 1e-3 }, // Henries
    connectionPoints: [
      { localPosition: [-0.5, 0, 0], label: "Terminal 1" },
      { localPosition: [0.5, 0, 0], label: "Terminal 2" },
    ],
    geometry: {
      type: "cylinder",
      args: [0.25, 0.25, 1.0, 16],
    },
  },
  transistor_npn: {
    label: "NPN Transistor",
    icon: "▶",
    color: "#34495E",
    category: "Semiconductor",
    defaultProperties: {},
    connectionPoints: [
      { localPosition: [-0.3, 0.3, 0], label: "Base" },
      { localPosition: [0.3, 0, 0], label: "Collector" },
      { localPosition: [0, -0.3, 0], label: "Emitter" },
    ],
    geometry: {
      type: "box",
      args: [0.6, 0.6, 0.3],
    },
  },
  transistor_mosfet: {
    label: "MOSFET",
    icon: "▶",
    color: "#34495E",
    category: "Semiconductor",
    defaultProperties: {},
    connectionPoints: [
      { localPosition: [-0.3, 0.3, 0], label: "Gate" },
      { localPosition: [0.3, 0, 0], label: "Drain" },
      { localPosition: [0, -0.3, 0], label: "Source" },
    ],
    geometry: {
      type: "box",
      args: [0.6, 0.6, 0.3],
    },
  },
};

