import { useEffect, useRef } from "react";
import { ComponentsPalette } from "./components/ComponentsPalette";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Toolbar } from "./components/Toolbar";
import { Scene } from "./three/Scene";
import { KeyboardControls } from "./components/KeyboardControls";
import { useCircuitState } from "./hooks/useCircuitState";
import { useSimulation } from "./hooks/useSimulation";
import { useUIStore } from "./store/uiStore";
import { useSimulationStore } from "./store/simulationStore";
import { type ComponentType } from "./@types/component-metadata.types";
import Simulator from "./@core/Simulator";

export default function App() {
  const {
    components,
    createAndAddComponent,
    removeComponent,
    updateComponentProperties,
    clear,
  } = useCircuitState();

  const { tool, gridVisible, setTool, toggleGrid, selectComponent } = useUIStore();
  const { isRunning, isPaused, start, pause, resume, stop } = useSimulation();
  const { initialize } = useSimulationStore();
  const simulatorRef = useRef<Simulator | null>(null);

  // Initialize simulator
  useEffect(() => {
    if (!simulatorRef.current) {
      const sim = new Simulator();
      simulatorRef.current = sim;
      initialize(sim);
    }
  }, [initialize]);

  // Sync components with simulator
  useEffect(() => {
    if (!simulatorRef.current) return;

    // Rebuild simulator with all components
    const sim = new Simulator();
    components.forEach((comp) => {
      sim.addComponent(comp.component);
    });
    sim.assignVoltageSourceIndices();
    simulatorRef.current = sim;
    initialize(sim);
  }, [components, initialize]);

  const handleAddComponent = (type: ComponentType) => {
    const position: [number, number, number] = [0, 0, 0];
    const id = createAndAddComponent(type, position);
    // Auto-select the newly created component
    selectComponent(id);
  };

  const handleUpdateComponent = (id: string, properties: Record<string, any>) => {
    updateComponentProperties(id, properties);
  };

  const handleDeleteComponent = (id: string) => {
    removeComponent(id);
    selectComponent(null);
  };

  const handleClear = () => {
    clear();
    stop();
    selectComponent(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Keyboard Controls (invisible component) */}
      <KeyboardControls />

      {/* Toolbar */}
      <Toolbar
        tool={tool}
        onToolChange={setTool}
        gridVisible={gridVisible}
        onGridToggle={toggleGrid}
        onClear={handleClear}
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={() => start()}
        onPause={pause}
        onResume={resume}
        onStop={stop}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Components Palette - Left side */}
        <ComponentsPalette onAddComponent={handleAddComponent} />

        {/* 3D Scene - Center */}
        <div className="flex-1 relative">
          <Scene gridVisible={gridVisible} />
          
          {/* Properties Panel - Right side (overlay on scene) */}
          {components.length > 0 && (
            <div className="absolute top-0 right-0 h-full">
              <PropertiesPanel
                components={components}
                onUpdate={handleUpdateComponent}
                onDelete={handleDeleteComponent}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status bar (optional) */}
      <div className="h-6 bg-slate-900 border-t border-slate-700 px-4 flex items-center text-xs text-slate-400">
        <span>Componentes: {components.length}</span>
        <span className="mx-2">|</span>
        <span>Herramienta: {tool}</span>
        {components.length > 0 && (
          <>
            <span className="mx-2">|</span>
            <span>Presiona R para rotar, Arrastrar para mover</span>
          </>
        )}
      </div>
    </div>
  );
}