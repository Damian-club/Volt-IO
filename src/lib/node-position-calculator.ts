import * as THREE from "three";
import { type ConnectionPoint, type CircuitComponent3D } from "../@types/circuit.types";

/**
 * Calculates world positions for connection points
 */
export function getConnectionPointWorldPosition(
  connectionPoint: ConnectionPoint,
  component: CircuitComponent3D
): THREE.Vector3 {
  const localPos = new THREE.Vector3(...connectionPoint.localPosition);
  const componentPos = new THREE.Vector3(...component.position);
  return localPos.add(componentPos);
}

/**
 * Gets all connection points for a component in world space
 */
export function getComponentConnectionPoints(
  component: CircuitComponent3D
): Array<{ point: ConnectionPoint; worldPosition: THREE.Vector3 }> {
  return component.connectionPoints.map((point) => ({
    point,
    worldPosition: getConnectionPointWorldPosition(point, component),
  }));
}

