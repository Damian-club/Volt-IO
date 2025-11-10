import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import type { CircuitComponent, Connection } from '../App';
import { Component3D } from './Component3D';
import { Wire3D } from './Wire3D';

interface CircuitCanvas3DProps {
  components: CircuitComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<CircuitComponent>) => void;
  onDeleteComponent: (id: string) => void;
  tool: 'select' | 'wire' | 'delete';
  gridVisible: boolean;
  onAddConnection: (from: string, to: string) => void;
}

export function CircuitCanvas3D({
  components,
  connections,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  tool,
  gridVisible,
  onAddConnection,
}: CircuitCanvas3DProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
      <OrbitControls makeDefault />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />
      
      {gridVisible && (
        <>
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#334155"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#475569"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
          />
        </>
      )}
      
      {components.map((component) => (
        <Component3D
          key={component.id}
          component={component}
          isSelected={selectedComponent === component.id}
          onSelect={() => {
            if (tool === 'select') {
              onSelectComponent(component.id);
            } else if (tool === 'delete') {
              onDeleteComponent(component.id);
            }
          }}
          onPositionChange={(position) => {
            onUpdateComponent(component.id, { position });
          }}
          tool={tool}
        />
      ))}
      
      {connections.map((connection) => (
        <Wire3D key={connection.id} connection={connection} />
      ))}
    </Canvas>
  );
}
