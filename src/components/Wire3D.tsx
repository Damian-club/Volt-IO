import { type Connection } from '../App';
import * as THREE from 'three';
import { useMemo } from 'react';

interface Wire3DProps {
  connection: Connection;
}

export function Wire3D({ connection }: Wire3DProps) {
  const points = useMemo(() => {
    return connection.points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  }, [connection.points]);

  const curve = useMemo(() => {
    if (points.length === 2) {
      const midpoint = new THREE.Vector3()
        .addVectors(points[0], points[1])
        .multiplyScalar(0.5);
      midpoint.y += 1;
      
      return new THREE.QuadraticBezierCurve3(
        points[0],
        midpoint,
        points[1]
      );
    }
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
  }, [curve]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial
        color="#DC2626"
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}
