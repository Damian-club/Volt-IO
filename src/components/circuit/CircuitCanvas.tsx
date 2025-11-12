import Component from "../../@core/components/Component";
import type { CircuitComponent3D } from "@/@types/circuit.types";

import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import * as THREE from "three";

// ============ IMPORTS DE TU SISTEMA EXISTENTE ============
// import Simulator from "./Simulator";
// import Node from "./nodes/Node";
// import Component from "./components/Component";
// import Resistor from "./components/Resistor";
// import VoltageSource from "./components/VoltageSource";

// ============ SISTEMA DE ELEMENTOS 3D ============

/**
 * Terminal física en el espacio 3D conectada a un nodo eléctrico
 */
class Terminal {
  id: string;
  localPosition: THREE.Vector3;
  node: any; // Node del sistema existente
  parentId: string;

  constructor(
    id: string,
    localPosition: THREE.Vector3,
    node: any,
    parentId: string
  ) {
    this.id = id;
    this.localPosition = localPosition;
    this.node = node;
    this.parentId = parentId;
  }

  getWorldPosition(elementPosition: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3().copy(this.localPosition).add(elementPosition);
  }
}

/**
 * Configuración visual de un elemento 3D
 */
interface Element3DConfig {
  geometry: THREE.BufferGeometry;
  color: string;
  terminals: { position: THREE.Vector3; node: any }[];
  label?: string;
  hoverColor?: string;
}

/**
 * Elemento 3D que conecta la visualización con el componente del simulador
 */
class Element3D {
  id: string;
  position: THREE.Vector3;
  terminals: Terminal[];
  component: any; // Component del sistema existente
  type: string;
  config: Element3DConfig;

  constructor(
    id: string,
    position: THREE.Vector3,
    component: any,
    type: string,
    config: Element3DConfig
  ) {
    this.id = id;
    this.position = position;
    this.component = component;
    this.type = type;
    this.config = config;
    this.terminals = config.terminals.map(
      (t, idx) => new Terminal(`${id}-t${idx}`, t.position, t.node, id)
    );
  }

  updatePosition(newPosition: THREE.Vector3) {
    this.position.copy(newPosition);
  }
}

// ============ CONTEXT PARA GESTIÓN DE CIRCUITO ============

interface CircuitContextType {
  simulator: any; // Simulator del sistema existente
  elements: Element3D[];
  connections: Map<string, string>;
  addElement: (element: Element3D) => void;
  removeElement: (id: string) => void;
  connectTerminals: (t1: string, t2: string) => void;
  disconnectTerminal: (terminalId: string) => void;
  runSimulation: (dt: number, steps: number) => void;
  simulationResults: any[];
}

const CircuitContext = createContext<CircuitContextType | null>(null);

export const useCircuit = () => {
  const context = useContext(CircuitContext);
  if (!context)
    throw new Error("useCircuit must be used within CircuitProvider");
  return context;
};

// ============ COMPONENTES 3D ============

function Terminal3D({
  position,
  isHovered,
  isConnected,
  isSelected,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: {
  position: THREE.Vector3;
  isHovered: boolean;
  isConnected: boolean;
  isSelected: boolean;
  onPointerDown: (e: any) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const getColor = () => {
    if (isSelected) return "#f59e0b";
    if (isHovered) return "#fbbf24";
    if (isConnected) return "#10b981";
    return "#ef4444";
  };

  return (
    <mesh
      position={position}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={getColor()}
        emissive={getColor()}
        emissiveIntensity={isHovered || isSelected ? 0.5 : 0.3}
      />
    </mesh>
  );
}

function Wire({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <lineBasicMaterial color="#3b82f6" linewidth={3} />
    </line>
  );
}

function DraggableElement3D({
  element,
  orbitControlsRef,
  onTerminalClick,
  hoveredTerminal,
  selectedTerminal,
  connections,
}: {
  element: Element3D;
  orbitControlsRef: React.RefObject<any>;
  onTerminalClick: (terminalId: string) => void;
  hoveredTerminal: string | null;
  selectedTerminal: string | null;
  connections: Set<string>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [plane] = useState(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  );
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [offset] = useState(() => new THREE.Vector3());
  const [localHovered, setLocalHovered] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || !groupRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const intersection = new THREE.Vector3();
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      const newPos = intersection.sub(offset);
      groupRef.current.position.copy(newPos);
      element.updatePosition(newPos);
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    isDragging,
    gl,
    camera,
    plane,
    raycaster,
    offset,
    orbitControlsRef,
    element,
  ]);

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;

    const intersection = new THREE.Vector3();
    raycaster.setFromCamera(e.pointer, camera);
    raycaster.ray.intersectPlane(plane, intersection);
    offset.copy(intersection).sub(groupRef.current!.position);
  };

  const color =
    isDragging || localHovered
      ? element.config.hoverColor || "#fb923c"
      : element.config.color;

  return (
    <group ref={groupRef} position={element.position}>
      {/* Cuerpo del componente */}
      <mesh
        onPointerDown={onPointerDown}
        onPointerEnter={() => setLocalHovered(true)}
        onPointerLeave={() => setLocalHovered(false)}
        castShadow
        geometry={element.config.geometry}
      >
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Etiqueta */}
      {element.config.label && (
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#1f2937" opacity={0.8} transparent />
        </mesh>
      )}

      {/* Terminales */}
      {element.terminals.map((terminal) => {
        const localPos = terminal.localPosition;
        return (
          <Terminal3D
            key={terminal.id}
            position={localPos}
            isHovered={hoveredTerminal === terminal.id}
            isConnected={connections.has(terminal.id)}
            isSelected={selectedTerminal === terminal.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              onTerminalClick(terminal.id);
            }}
            onPointerEnter={() => {}}
            onPointerLeave={() => {}}
          />
        );
      })}
    </group>
  );
}

// ============ PROVEEDOR DE CONTEXTO ============

export function CircuitProvider({
  simulator,
  children,
}: {
  simulator: any;
  children: React.ReactNode;
}) {
  const [elements, setElements] = useState<Element3D[]>([]);
  const [connections, setConnections] = useState<Map<string, string>>(
    new Map()
  );
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const addElement = (element: Element3D) => {
    setElements((prev) => [...prev, element]);
    simulator.addComponent(element.component);
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
  };

  const connectTerminals = (t1Id: string, t2Id: string) => {
    const allTerminals = elements.flatMap((e) => e.terminals);
    const t1 = allTerminals.find((t) => t.id === t1Id);
    const t2 = allTerminals.find((t) => t.id === t2Id);

    if (t1 && t2 && t1.parentId !== t2.parentId) {
      t1.node.mergeWith(t2.node);
      setConnections(new Map(connections.set(t1Id, t2Id)));
    }
  };

  const disconnectTerminal = (terminalId: string) => {
    const newConnections = new Map(connections);
    newConnections.delete(terminalId);
    for (const [key, value] of newConnections.entries()) {
      if (value === terminalId) newConnections.delete(key);
    }
    setConnections(newConnections);
  };

  const runSimulation = (dt: number, steps: number) => {
    const results = simulator.runTransient(dt, steps);
    setSimulationResults(results);
    console.log("Simulation completed:", results);
  };

  return (
    <CircuitContext.Provider
      value={{
        simulator,
        elements,
        connections,
        addElement,
        removeElement,
        connectTerminals,
        disconnectTerminal,
        runSimulation,
        simulationResults,
      }}
    >
      {children}
    </CircuitContext.Provider>
  );
}

// ============ CANVAS PRINCIPAL ============

function CircuitScene() {
  const orbitControlsRef = useRef<any>(null);
  const { elements, connections, connectTerminals } = useCircuit();
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  const handleTerminalClick = (terminalId: string) => {
    if (!selectedTerminal) {
      setSelectedTerminal(terminalId);
    } else if (selectedTerminal !== terminalId) {
      connectTerminals(selectedTerminal, terminalId);
      setSelectedTerminal(null);
    } else {
      setSelectedTerminal(null);
    }
  };

  const connectedTerminals = new Set([
    ...connections.keys(),
    ...connections.values(),
  ]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Elementos del circuito */}
      {elements.map((element) => (
        <DraggableElement3D
          key={element.id}
          element={element}
          orbitControlsRef={orbitControlsRef}
          onTerminalClick={handleTerminalClick}
          hoveredTerminal={hoveredTerminal}
          selectedTerminal={selectedTerminal}
          connections={connectedTerminals}
        />
      ))}

      {/* Cables de conexión */}
      {Array.from(connections.entries()).map(([t1Id, t2Id]) => {
        const allTerminals = elements.flatMap((e) => e.terminals);
        const t1 = allTerminals.find((t) => t.id === t1Id);
        const t2 = allTerminals.find((t) => t.id === t2Id);

        if (t1 && t2) {
          const start = t1.getWorldPosition(
            elements.find((e) => e.id === t1.parentId)!.position
          );
          const end = t2.getWorldPosition(
            elements.find((e) => e.id === t2.parentId)!.position
          );
          return <Wire key={`${t1Id}-${t2Id}`} start={start} end={end} />;
        }
        return null;
      })}

      <Grid
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ffffff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={66}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      <axesHelper args={[2]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}


export interface CircuitCanvasProps {
  components: CircuitComponent3D[];
  selected: Element3D | null;
  onSelect: (c: Element3D | null) => void;
  gridVisible: boolean;
}

export default function CircuitCanvas(props: CircuitCanvasProps) {
  // Destructure props if needed in future, but avoid unused destructuring.
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas shadows>
        <CircuitScene />
      </Canvas>
    </div>
  );
}

// ============ FUNCIONES AUXILIARES PARA CREAR COMPONENTES ============

/**
 * Crea un elemento resistencia 3D
 */
export function createResistor(
  id: string,
  position: THREE.Vector3,
  ResistorClass: any,
  NodeClass: any,
  value: number
): Element3D {
  const n1 = new NodeClass();
  const n2 = new NodeClass();
  const component = new ResistorClass(`R_${id}`, [n1, n2], value);

  const geometry = new THREE.BoxGeometry(1.5, 0.4, 0.4);

  return new Element3D(id, position, component, "resistor", {
    geometry,
    color: "#9d4b4b",
    hoverColor: "#fb923c",
    terminals: [
      { position: new THREE.Vector3(-0.75, 0, 0), node: n1 },
      { position: new THREE.Vector3(0.75, 0, 0), node: n2 },
    ],
    label: `${value}Ω`,
  });
}

/**
 * Crea un elemento fuente de voltaje 3D
 */
export function createVoltageSource(
  id: string,
  position: THREE.Vector3,
  VoltageSourceClass: any,
  NodeClass: any,
  voltage: number
): Element3D {
  const n1 = new NodeClass();
  const n2 = new NodeClass();
  const component = new VoltageSourceClass(`V_${id}`, [n1, n2], {
    Vdc: voltage,
  });

  const geometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);

  return new Element3D(id, position, component, "voltage_source", {
    geometry,
    color: "#2f7f4f",
    hoverColor: "#4ade80",
    terminals: [
      { position: new THREE.Vector3(0, 0.4, 0), node: n1 },
      { position: new THREE.Vector3(0, -0.4, 0), node: n2 },
    ],
    label: `${voltage}V`,
  });
}

/**
 * Crea un elemento capacitor 3D
 */
export function createCapacitor(
  id: string,
  position: THREE.Vector3,
  CapacitorClass: any,
  NodeClass: any,
  value: number
): Element3D {
  const n1 = new NodeClass();
  const n2 = new NodeClass();
  const component = new CapacitorClass(`C_${id}`, [n1, n2], value);

  const geometry = new THREE.BoxGeometry(0.3, 1.0, 0.4);

  return new Element3D(id, position, component, "capacitor", {
    geometry,
    color: "#3b5b9d",
    hoverColor: "#60a5fa",
    terminals: [
      { position: new THREE.Vector3(0, 0.5, 0), node: n1 },
      { position: new THREE.Vector3(0, -0.5, 0), node: n2 },
    ],
    label: `${value}F`,
  });
}

/**
 * Crea un elemento genérico personalizado
 */
export function createCustomElement(
  id: string,
  position: THREE.Vector3,
  component: any,
  type: string,
  config: Element3DConfig
): Element3D {
  return new Element3D(id, position, component, type, config);
}
