import Simulator from "../@core/Simulator";
import { type CircuitComponent3D } from "../@types/circuit.types";
import Component from "../@core/components/Component";

/**
 * Syncs UI state (components) with the Simulator class
 */
export class SimulationBridge {
  private simulator: Simulator;

  constructor() {
    this.simulator = new Simulator();
  }

  /**
   * Add a component to the simulator
   */
  addComponent(component: CircuitComponent3D) {
    this.simulator.addComponent(component.component);
    this.simulator.assignVoltageSourceIndices();
  }

  /**
   * Remove a component from the simulator
   */
  removeComponent(component: CircuitComponent3D) {
    // Note: Simulator doesn't have removeComponent, so we'd need to rebuild
    // For now, we'll just reassign indices
    this.simulator.assignVoltageSourceIndices();
  }

  /**
   * Sync all components from UI state to simulator
   */
  syncComponents(components: CircuitComponent3D[]) {
    // Rebuild simulator with all components
    this.simulator = new Simulator();
    components.forEach((comp) => {
      this.simulator.addComponent(comp.component);
    });
    this.simulator.assignVoltageSourceIndices();
  }

  /**
   * Get the simulator instance
   */
  getSimulator(): Simulator {
    return this.simulator;
  }

  /**
   * Run a simulation step
   */
  runStep(dt: number, steps: number) {
    this.simulator.runTransient(dt, steps);
  }
}

