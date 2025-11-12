import * as THREE from "three";
import { type ConnectionPoint, type CircuitComponent3D } from "../@types/circuit.types";
import { getConnectionPointWorldPosition } from "./node-position-calculator";

/**
 * Generates 3D wire geometry between two connection points
 */
export function generateWireGeometry(
  from: ConnectionPoint,
  to: ConnectionPoint,
  fromComponent: CircuitComponent3D,
  toComponent: CircuitComponent3D
): THREE.BufferGeometry {
  const start = getConnectionPointWorldPosition(from, fromComponent);
  const end = getConnectionPointWorldPosition(to, toComponent);

  const points = [start, end];
  return new THREE.BufferGeometry().setFromPoints(points);
}

/**
 * Creates a curved wire geometry (for better visual appearance)
 */
export function generateCurvedWireGeometry(
  from: ConnectionPoint,
  to: ConnectionPoint,
  fromComponent: CircuitComponent3D,
  toComponent: CircuitComponent3D,
  curvePoints: number = 10
): THREE.BufferGeometry {
  const start = getConnectionPointWorldPosition(from, fromComponent);
  const end = getConnectionPointWorldPosition(to, toComponent);

  // Create a simple arc curve
  const midPoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  midPoint.y += 0.5; // Arc height

  const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
  const points = curve.getPoints(curvePoints);

  return new THREE.BufferGeometry().setFromPoints(points);
}

