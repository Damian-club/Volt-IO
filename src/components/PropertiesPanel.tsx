import { useState, useEffect } from "react";
import { useComponentSelection } from "../hooks/useComponentSelection";
import { useCircuitState } from "../hooks/useCircuitState";
import { type CircuitComponent3D } from "../@types/circuit.types";

interface PropertiesPanelProps {
  components: CircuitComponent3D[];
  onUpdate: (id: string, properties: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

export function PropertiesPanel({
  components,
  onUpdate,
  onDelete,
}: PropertiesPanelProps) {
  const { selectedComponentId } = useComponentSelection();
  const { moveComponent, rotateComponent } = useCircuitState();
  
  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  const [localRotation, setLocalRotation] = useState({ x: 0, y: 0, z: 0 });
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0, z: 0 });

  // Sync local state when selection changes
  useEffect(() => {
    if (selectedComponent) {
      setLocalRotation({
        x: Math.round((selectedComponent.rotation[0] * 180) / Math.PI),
        y: Math.round((selectedComponent.rotation[1] * 180) / Math.PI),
        z: Math.round((selectedComponent.rotation[2] * 180) / Math.PI),
      });
      setLocalPosition({
        x: selectedComponent.position[0],
        y: selectedComponent.position[1],
        z: selectedComponent.position[2],
      });
    }
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-700 p-4 shadow-xl">
        <div className="text-center text-slate-400 text-sm py-8">
          <div className="mb-2">
            <svg className="w-12 h-12 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p>Selecciona un componente</p>
          <p className="text-xs mt-2">para ver sus propiedades</p>
        </div>
      </div>
    );
  }

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    const newRotation = { ...localRotation, [axis]: value };
    setLocalRotation(newRotation);

    const radians: [number, number, number] = [
      (newRotation.x * Math.PI) / 180,
      (newRotation.y * Math.PI) / 180,
      (newRotation.z * Math.PI) / 180,
    ];
    rotateComponent(selectedComponent.id, radians);
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    const newPosition = { ...localPosition, [axis]: value };
    setLocalPosition(newPosition);
    moveComponent(selectedComponent.id, [newPosition.x, newPosition.y, newPosition.z]);
  };

  const handleQuickRotate = (axis: "x" | "y" | "z", degrees: number) => {
    const newValue = localRotation[axis] + degrees;
    handleRotationChange(axis, newValue);
  };

  const handleReset = (type: "position" | "rotation") => {
    if (type === "position") {
      setLocalPosition({ x: 0, y: 0, z: 0 });
      moveComponent(selectedComponent.id, [0, 0, 0]);
    } else {
      setLocalRotation({ x: 0, y: 0, z: 0 });
      rotateComponent(selectedComponent.id, [0, 0, 0]);
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto shadow-xl h-full">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 z-10">
        <h2 className="text-lg font-semibold text-slate-100">Propiedades</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Component Info */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Tipo de Componente</div>
          <div className="text-slate-100 font-medium text-lg">{selectedComponent.type}</div>
          <div className="text-xs text-slate-500 mt-1 truncate">ID: {selectedComponent.id}</div>
        </div>

        {/* Position Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Posición</h3>
            <button
              onClick={() => handleReset("position")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resetear
            </button>
          </div>
          <div className="space-y-2">
            {(["x", "y", "z"] as const).map((axis) => (
              <div key={axis} className="flex items-center gap-2">
                <label className="text-sm text-slate-400 w-6 uppercase font-mono">
                  {axis}
                </label>
                <input
                  type="number"
                  value={localPosition[axis].toFixed(2)}
                  onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value) || 0)}
                  step="0.5"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                />
                <span className="text-xs text-slate-500 w-6">m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Rotación</h3>
            <button
              onClick={() => handleReset("rotation")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resetear
            </button>
          </div>
          <div className="space-y-3">
            {(["x", "y", "z"] as const).map((axis) => (
              <div key={axis}>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-slate-400 w-6 uppercase font-mono">
                    {axis}
                  </label>
                  <input
                    type="number"
                    value={localRotation[axis]}
                    onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value) || 0)}
                    step="1"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  />
                  <span className="text-xs text-slate-500 w-6">°</span>
                </div>
                <div className="flex gap-1 ml-8">
                  <button
                    onClick={() => handleQuickRotate(axis, -90)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded transition-colors"
                  >
                    -90°
                  </button>
                  <button
                    onClick={() => handleQuickRotate(axis, -45)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded transition-colors"
                  >
                    -45°
                  </button>
                  <button
                    onClick={() => handleQuickRotate(axis, 45)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded transition-colors"
                  >
                    +45°
                  </button>
                  <button
                    onClick={() => handleQuickRotate(axis, 90)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded transition-colors"
                  >
                    +90°
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component Properties */}
        {Object.keys(selectedComponent.properties).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-slate-200">
              Propiedades del Componente
            </h3>
            <div className="space-y-2">
              {Object.entries(selectedComponent.properties).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm text-slate-400 mb-1 block capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => onUpdate(selectedComponent.id, { [key]: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(selectedComponent.id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-lg"
        >
          Eliminar Componente
        </button>

        {/* Keyboard Shortcuts */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-xs font-semibold text-slate-400 mb-3">Atajos de Teclado</h4>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex justify-between items-center">
              <span><kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">R</kbd> Rotar Y +90°</span>
              <span><kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">Shift+R</kbd> -90°</span>
            </div>
            <div className="flex justify-between items-center">
              <span><kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">X</kbd> Rotar X</span>
              <span><kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">Z</kbd> Rotar Z</span>
            </div>
            <div>
              <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">Del</kbd> Eliminar componente
            </div>
            <div>
              <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono">Esc</kbd> Deseleccionar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}