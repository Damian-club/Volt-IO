import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useCircuitStore } from "../../store/circuitStore";
import { type WireConnection } from "../../@types/circuit.types";

interface WireData {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  fromLocal: [number, number, number];
  toLocal: [number, number, number];
}

export function WireMesh({ wire }: { wire: WireConnection }) {
  const wireDataRef = useRef<WireData | null>(null);
  
  // Subscribe to store changes but don't cause re-renders
  useEffect(() => {
    const updateWireData = (state: ReturnType<typeof useCircuitStore.getState>) => {
      const comps = Array.from(state.components.values());
      const fromComp = comps.find((c) =>
        c.connectionPoints.some((cp) => cp.id === wire.from)
      );
      const toComp = comps.find((c) =>
        c.connectionPoints.some((cp) => cp.id === wire.to)
      );

      if (!fromComp || !toComp) {
        wireDataRef.current = null;
        return;
      }

      const fromPoint = fromComp.connectionPoints.find(
        (cp) => cp.id === wire.from
      );
      const toPoint = toComp.connectionPoints.find((cp) => cp.id === wire.to);

      if (!fromPoint || !toPoint) {
        wireDataRef.current = null;
        return;
      }

      wireDataRef.current = {
        fromPos: fromComp.position,
        toPos: toComp.position,
        fromLocal: [
          fromPoint.localPosition.x,
          fromPoint.localPosition.y,
          fromPoint.localPosition.z,
        ],
        toLocal: [
          toPoint.localPosition.x,
          toPoint.localPosition.y,
          toPoint.localPosition.z,
        ],
      };
    };

    // Initial update
    updateWireData(useCircuitStore.getState());

    // Subscribe to changes
    const unsubscribe = useCircuitStore.subscribe(updateWireData);
    return unsubscribe;
  }, [wire.from, wire.to]);

  // Create geometry once
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
  }, []);

  // Update line positions in useFrame
  useFrame(() => {
    if (!wireDataRef.current) return;

    const wireData = wireDataRef.current;
    const start = new THREE.Vector3(
      wireData.fromLocal[0] + wireData.fromPos[0],
      wireData.fromLocal[1] + wireData.fromPos[1],
      wireData.fromLocal[2] + wireData.fromPos[2]
    );

    const end = new THREE.Vector3(
      wireData.toLocal[0] + wireData.toPos[0],
      wireData.toLocal[1] + wireData.toPos[1],
      wireData.toLocal[2] + wireData.toPos[2]
    );

    geometry.setFromPoints([start, end]);
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#3b82f6", linewidth: 2 }))} />
  );
}
