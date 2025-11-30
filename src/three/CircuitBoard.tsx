import { useCircuitState } from "../hooks/useCircuitState";
import { useUIStore } from "../store/uiStore";
import { Component3D } from "./components/Component3D";
import { WireMesh } from "./connection/WireMesh";
import { ConnectionManager } from "./connection/ConnectionManager";

export function CircuitBoard() {
  const { components, wires, moveComponent, rotateComponent } = useCircuitState();
  const { selectComponent } = useUIStore();

  // Handle clicking on empty space (deselect)
  const handleBackgroundClick = () => {
    selectComponent(null);
  };

  return (
    <>
      {/* Invisible plane for deselection */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleBackgroundClick}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Connection Manager */}
      <ConnectionManager />
      
      {/* Render all components */}
      {components.map((component) => (
        <Component3D 
          key={component.id} 
          component={component}
          onMove={moveComponent}
          onRotate={rotateComponent}
        />
      ))}

      {/* Render wires */}
      {Array.from(wires).map((wire) => (
        <WireMesh key={wire.id} wire={wire} />
      ))}
    </>
  );
}