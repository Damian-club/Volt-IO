import { useCircuitState } from "../hooks/useCircuitState";
import { Component3D } from "./components/Component3D";
import { WireMesh } from "./connection/WireMesh";
import { ConnectionManager } from "./connection/ConnectionManager";

export function CircuitBoard() {
  const { components, wires } = useCircuitState();

  return (
    <>
      <ConnectionManager />
      
      {components.map((component) => (
        <Component3D key={component.id} component={component} />
      ))}

      {Array.from(wires).map((wire) => (
        <WireMesh key={wire.id} wire={wire} />
      ))}
    </>
  );
}

