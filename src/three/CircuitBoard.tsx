import { useCircuitState } from "../hooks/useCircuitState";
import { useUIStore } from "../store/uiStore";
import { Component3D } from "./components/Component3D";
import { WirePreview } from "./connection/WirePreview";
import { ConnectionManager } from "./connection/ConnectionManager";
import { WireMesh } from "./connection/WireMesh";
import { Multimeter } from "./components/Multimeter";

export function CircuitBoard() {
  const { components, wires, moveComponent, rotateComponent, removeComponent } =
    useCircuitState();
  const { selectComponent, tool } = useUIStore();

  // Handle clicking on empty space
  const handleBackgroundClick = () => {
    selectComponent(null);
  };

  // Handle component deletion
  const handleDeleteComponent = (id: string) => {
    removeComponent(id);
    selectComponent(null);
  };

  return (
    <>
      {/* Invisible plane for deselection and ground reference */}
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

      {/* Render all existing wires */}
      {Array.from(wires).map((wire) => (
        <WireMesh key={wire.id} wire={wire} />
      ))}
      {/* Wire preview when in wire mode */}
      <WirePreview />
      <Multimeter />
      {/* Render all components */}
      {components.map((component) => (
        <Component3D
          key={component.id}
          component={component}
          onMove={moveComponent}
          onRotate={rotateComponent}
          onDelete={handleDeleteComponent}
        />
      ))}

      {/* Tool indicator in scene */}
      {tool !== "select" && (
        <group position={[0, 5, 0]}>
          {/* This could show current tool status */}
        </group>
      )}
    </>
  );
}
