import * as THREE from "three";
import Component from "../@core/components/Component";
import Node from "../@core/nodes/Node";

/**
 * Connection point on a 3D component
 */
export interface ConnectionPoint {
  id: string;
  localPosition: THREE.Vector3;
  node: Node;
  componentId: string;
}

/**
 * Wire connection between two connection points
 */
export interface WireConnection {
  id: string;
  from: string; // connection point id
  to: string; // connection point id
}

/**
 * 3D Component instance in the circuit
 */
export interface CircuitComponent3D {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  component: Component; // The simulation component
  connectionPoints: ConnectionPoint[];
  properties: Record<string, any>;
}

/**
 * Component metadata for UI and 3D representation
 */
export interface ComponentMetadata {
  label: string;
  icon: string;
  color: string;
  category: string;
  defaultProperties: Record<string, any>;
  connectionPoints: {
    localPosition: [number, number, number];
    label?: string;
  }[];
  geometry?: {
    type: "box" | "cylinder" | "sphere" | "custom";
    args?: number[];
  };
}

/**
 * Simulation state
 */
export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  dt: number;
  step: number;
}

