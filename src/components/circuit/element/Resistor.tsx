import * as THREE from 'three'
import Node from '@/@core/nodes/Node'
import Component from '@/@core/components/Component'
import ResistorComponent from '@/@core/components/Resistor'
import ElectricalComponent from './ElectricalComponent'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

export default class Resistor extends ElectricalComponent {
  private _resistance: number

  constructor({
    name,
    position,
    rotation,
    resistance = 1000,
  }: {
    name: string
    position?: THREE.Vector3
    rotation?: THREE.Euler
    resistance?: number
  }) {
    super({ name, position, rotation })
    this._resistance = resistance
  }

  async loadModel() {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync('/models/resistor.glb')
    this.model = gltf.scene
    this.model.scale.set(0.4, 0.4, 0.4)
  }

  buildNodes() {
    this.nodes = [
      { position: new THREE.Vector3(-0.5, 0, 0) },
      { position: new THREE.Vector3(0.5, 0, 0) },
    ]
  }

  /** Devuelve el Resistor lógico del simulador */
  createComponent(nodeArray: Node[]): Component {
    return new ResistorComponent(this.name, nodeArray, this._resistance)
  }
}
