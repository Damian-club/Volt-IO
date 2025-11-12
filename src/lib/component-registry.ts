import Component from "../@core/components/Component";
import Resistor from "../@core/components/Resistor";
import Capacitor from "../@core/components/Capacitor";
import VoltageSource from "../@core/components/VoltageSource";
import LED from "../@core/components/LED";
import Diode from "../@core/components/Diode";
import Switch from "../@core/components/Switch";
import Coil from "../@core/components/Coil";
import Transistor_NPN_BJT from "../@core/components/Transistor_NPN_BJT";
import Transistor_N_MOSFET from "../@core/components/Transistor_N_MOSFET";
import { type ComponentType, COMPONENT_METADATA } from "../@types/component-metadata.types";
import Node from "../@core/nodes/Node";

/**
 * Maps component types to their class constructors
 */
export const ComponentRegistry: Record<ComponentType, new (name: string, nodeArray: Node[], ...args: any[]) => Component> = {
  resistor: Resistor,
  capacitor: Capacitor,
  voltageSource: VoltageSource,
  led: LED,
  diode: Diode,
  switch: Switch,
  coil: Coil,
  transistor_npn: Transistor_NPN_BJT,
  transistor_mosfet: Transistor_N_MOSFET,
};

/**
 * Creates a component instance from type and properties
 */
export function createComponent(
  type: ComponentType,
  name: string,
  nodeArray: Node[],
  properties: Record<string, any>
): Component {
  const ComponentClass = ComponentRegistry[type];
  const metadata = COMPONENT_METADATA[type];

  if (!ComponentClass) {
    throw new Error(`Unknown component type: ${type}`);
  }

  // Map properties to constructor arguments based on component type
  switch (type) {
    case "resistor":
      return new ComponentClass(name, nodeArray, properties.value ?? metadata.defaultProperties.value);
    case "capacitor":
      return new ComponentClass(name, nodeArray, properties.value ?? metadata.defaultProperties.value);
    case "voltageSource":
      return new ComponentClass(name, nodeArray, {
        Vdc: properties.Vdc ?? metadata.defaultProperties.Vdc,
        mode: properties.mode ?? metadata.defaultProperties.mode,
        Vac: properties.Vac,
        freq: properties.freq,
        phase: properties.phase,
      });
    case "led":
      return new ComponentClass(name, nodeArray, properties.forwardVoltage ?? metadata.defaultProperties.forwardVoltage);
    case "diode":
      return new ComponentClass(name, nodeArray, properties.Is, properties.n, properties.Vt);
    case "switch":
      return new ComponentClass(name, nodeArray, properties.closed ?? metadata.defaultProperties.closed);
    case "coil":
      return new ComponentClass(name, nodeArray, properties.value ?? metadata.defaultProperties.value);
    case "transistor_npn":
      return new ComponentClass(name, nodeArray, properties);
    case "transistor_mosfet":
      return new ComponentClass(name, nodeArray, properties);
    default:
      throw new Error(`Unhandled component type: ${type}`);
  }
}

/**
 * Gets metadata for a component type
 */
export function getComponentMetadata(type: ComponentType) {
  return COMPONENT_METADATA[type];
}

