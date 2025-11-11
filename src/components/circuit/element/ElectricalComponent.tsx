// src/classes/ElectricalComponent3D.ts
import * as THREE from 'three'
import Node from '@/@core/nodes/Node'
import Component from '@/@core/components/Component'

export type VisualNode = {
  position: THREE.Vector3
  mesh?: THREE.Mesh
}

export default abstract class ElectricalComponent {
  model: THREE.Object3D | null = null
  nodes: VisualNode[] = []
  position: THREE.Vector3
  rotation: THREE.Euler
  name: string

  constructor({
    name,
    position = new THREE.Vector3(),
    rotation = new THREE.Euler(),
  }: {
    name: string
    position?: THREE.Vector3
    rotation?: THREE.Euler
  }) {
    this.name = name
    this.position = position
    this.rotation = rotation
  }

  /** Carga el modelo 3D (por ejemplo, un GLTF) */
  abstract loadModel(): Promise<void>

  /** Define los nodos de conexión (posiciones relativas) */
  abstract buildNodes(): void

  /** Crea y retorna el componente lógico (de simulación) correspondiente */
  abstract createComponent(nodeArray: Node[]): Component

  /** Ensambla el grupo Three.js (modelo + nodos visibles) */
  getObject3D(): THREE.Group {
    const group = new THREE.Group()

    if (this.model) group.add(this.model)

    for (const node of this.nodes) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      )
      sphere.position.copy(node.position)
      node.mesh = sphere
      group.add(sphere)
    }

    group.position.copy(this.position)
    group.rotation.copy(this.rotation)

    group.userData = {
      name: this.name,
      type: this.constructor.name,
    }

    return group
  }
}
