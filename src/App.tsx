import { useState } from 'react';
import { CircuitCanvas3D } from './components/CircuitCanvas3D';
import { ComponentsPalette } from './components/ComponentsPalette';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import './globals/globals.css';

export interface CircuitComponent {
  id: string;
  type: 'resistor' | 'capacitor' | 'led' | 'battery' | 'wire' | 'transistor' | 'chip';
  position: [number, number, number];
  rotation: [number, number, number];
  properties: {
    value?: string;
    color?: string;
    label?: string;
  };
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  points: [number, number, number][];
}

export default function App() {
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'wire' | 'delete'>('select');
  const [gridVisible, setGridVisible] = useState(true);

  const addComponent = (type: CircuitComponent['type']) => {
    const newComponent: CircuitComponent = {
      id: `${type}-${Date.now()}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      properties: {
        label: `${type} ${components.filter(c => c.type === type).length + 1}`,
        value: type === 'resistor' ? '1kΩ' : type === 'capacitor' ? '100μF' : '',
        color: type === 'led' ? 'red' : '#8B4513',
      },
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id: string, updates: Partial<CircuitComponent>) => {
    setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const addConnection = (from: string, to: string) => {
    const fromComponent = components.find(c => c.id === from);
    const toComponent = components.find(c => c.id === to);
    
    if (fromComponent && toComponent) {
      const newConnection: Connection = {
        id: `connection-${Date.now()}`,
        from,
        to,
        points: [fromComponent.position, toComponent.position],
      };
      setConnections([...connections, newConnection]);
    }
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950">
      <Toolbar
        tool={tool}
        onToolChange={setTool}
        gridVisible={gridVisible}
        onGridToggle={() => setGridVisible(!gridVisible)}
        onClear={() => {
          setComponents([]);
          setConnections([]);
          setSelectedComponent(null);
        }}
      />
      
      <div className="flex-1 flex ">
        <ComponentsPalette onAddComponent={addComponent} />
        
        <div className="flex-1 relative overflow-hidden">
          <CircuitCanvas3D
            components={components}
            connections={connections}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onUpdateComponent={updateComponent}
            onDeleteComponent={deleteComponent}
            tool={tool}
            gridVisible={gridVisible}
            onAddConnection={addConnection}
          />
        </div>
        
        {selectedComponentData && (
          <PropertiesPanel
            component={selectedComponentData}
            onUpdate={(updates) => updateComponent(selectedComponentData.id, updates)}
            onDelete={() => deleteComponent(selectedComponentData.id)}
          />
        )}
      </div>
    </div>
  );
}