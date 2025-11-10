import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import Simulator from "./@core/Simulator.js";
import Node from "./@core/nodes/Node.js";
import VoltageSource from "./@core/components/VoltageSource.js";
import Resistor from "./@core/components/Resistor.js";

const sim = new Simulator();
const n1 = new Node();
const n2 = new Node();

const v1 = new VoltageSource("V1", [n1, sim.ground], { Vdc: 10});
const r1 = new Resistor("R1", [n1, n2], 1000);
const r2 = new Resistor("R2", [n2, sim.ground], 2000);

sim.addComponent(v1);
sim.addComponent(r1);
sim.addComponent(r2);

console.log("=== Divisor ===");
console.log("Circuito: 10V -> R1(1k) -> R2(2k) -> GND");
console.log("Esperado: n2 ≈ 6.67V\n");

sim.runTransient(0.001, 5);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
