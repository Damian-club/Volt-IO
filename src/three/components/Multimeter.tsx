import { Html } from "@react-three/drei";
import { useUIStore } from "../../store/uiStore";
import { useCircuitStore } from "../../store/circuitStore";

export function Multimeter() {
  const { tool, multimeterPointA, multimeterPointB, clearMultimeter } =
    useUIStore();
  const { components, wires } = useCircuitStore();

  const isActive = tool === "multimeter";

  if (!isActive) return null;

  // Calcular mediciones reales
  const calculateMeasurements = () => {
    if (!multimeterPointA || !multimeterPointB) return null;

    // Encontrar los componentes y puntos
    let pointA = null;
    let pointB = null;
    let componentA = null;
    let componentB = null;

    // Buscar los puntos en todos los componentes
    for (const comp of Array.from(components.values())) {
      for (const cp of comp.connectionPoints) {
        if (cp.id === multimeterPointA) {
          pointA = cp;
          componentA = comp;
        }
        if (cp.id === multimeterPointB) {
          pointB = cp;
          componentB = comp;
        }
      }
    }

    if (!pointA || !pointB) return null;

    // Verificar si están conectados
    const areConnected = pointA.node === pointB.node;

    // Calcular voltaje (simulado por ahora)
    let voltage = 0;
    if (componentA && componentB) {
      // Para resistencias: V = I * R (simulación básica)
      if (componentA.type === "resistor" && componentA.properties.resistance) {
        voltage = 0.001 * componentA.properties.resistance; // I=1mA simulado
      } else if (
        componentB.type === "resistor" &&
        componentB.properties.resistance
      ) {
        voltage = 0.001 * componentB.properties.resistance;
      } else {
        // Voltaje aleatorio para otros componentes
        voltage = Math.random() * 5;
      }
    }

    return {
      voltage: parseFloat(voltage.toFixed(3)),
      connected: areConnected,
      pointA,
      pointB,
    };
  };

  const measurements = calculateMeasurements();

  return (
    <Html position={[0, 5, 0]} center>
      <div className="bg-slate-800 text-white p-4 rounded-lg shadow-xl min-w-72">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Multímetro</h3>
          <button
            onClick={clearMultimeter}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Reiniciar
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Punto A</div>
              <div
                className={
                  multimeterPointA
                    ? "text-green-400 font-mono"
                    : "text-gray-500"
                }
              >
                {multimeterPointA ? multimeterPointA.slice(-6) : "---"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Punto B</div>
              <div
                className={
                  multimeterPointB
                    ? "text-green-400 font-mono"
                    : "text-gray-500"
                }
              >
                {multimeterPointB ? multimeterPointB.slice(-6) : "---"}
              </div>
            </div>
          </div>

          {measurements && (
            <div className="mt-4 p-3 bg-slate-700 rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Voltaje:</span>
                <span className="text-yellow-300 font-mono text-lg">
                  {measurements.voltage} V
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Conexión:</span>
                <span
                  className={
                    measurements.connected ? "text-green-300" : "text-red-300"
                  }
                >
                  {measurements.connected ? "CONECTADO" : "ABIERTO"}
                </span>
              </div>
              {measurements.pointA && measurements.pointB && (
                <div className="text-xs text-gray-400 text-center mt-2">
                  {measurements.pointA.componentId.slice(-6)} →{" "}
                  {measurements.pointB.componentId.slice(-6)}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 border-t border-slate-600 pt-2">
            <div className="font-bold mb-1">Cómo usar:</div>
            <div>1. Haz clic en puntos de conexión normales</div>
            <div>2. Primero un punto, luego otro</div>
            <div>3. Ve los resultados aquí</div>
          </div>
        </div>
      </div>
    </Html>
  );
}
