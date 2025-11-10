import Node from "./nodes/Node";
import Component from "./components/Component";
import { matrix, lusolve } from "mathjs";
import VoltageSource from "./components/VoltageSource";

export default class Simulator {
    nodes: Node[] = [];
    components: Component[] = [];
    totalSize: number = 0;
    ground: Node;

    constructor() {
        this.ground = new Node();
        this.ground.voltage = 0;
        this.nodes.push(this.ground);
    }

    addNode(node: Node) {
        if (!this.nodes.includes(node)) this.nodes.push(node);
    }

    addComponent(c: Component) {
        this.components.push(c);
        c.nodeArray.forEach(n => this.addNode(n.master ?? n));
    }

    assignVoltageSourceIndices() {
        const N = this.nodes.length - 1;
        let extraIndex = N;

        this.components.forEach(c => {
            if (c instanceof VoltageSource) {
                c.index = extraIndex;
                extraIndex++;
            }
        });

        this.totalSize = extraIndex;
    }

    runTransient(dt: number, steps: number) {
        if (this.totalSize === 0) this.assignVoltageSourceIndices();

        const nodeIndexMap = new Map<Node, number>();
        this.nodes.forEach((n, idx) => {
            if (idx !== 0) nodeIndexMap.set(n.master, idx - 1);
        });

        for (let t = 0; t < steps; t++) {
            const M: number[][] = Array.from({ length: this.totalSize }, () =>
                Array(this.totalSize).fill(0)
            );
            const b: number[] = Array(this.totalSize).fill(0);

            this.components.forEach(c => {
                c.stamp(M, b, nodeIndexMap, dt);
            });

            const voltages = this.solve(M, b);

            this.components.forEach(c => {
                if (c.update) c.update(nodeIndexMap, voltages);
            });

            nodeIndexMap.forEach((idx, masterNode) => {
                masterNode.voltage = voltages[idx];
            });

            console.log(
                `t=${((t + 1) * dt).toFixed(6)}s`,
                this.nodes.map(n => `${n.master.voltage?.toFixed(4)}V`)
            );
        }
    }

    private solve(M: number[][], b: number[]): number[] {
        const A = matrix(M);
        const B = matrix(b);
        const X = lusolve(A, B);
        return (X.toArray() as number[][]).map((v: number[]) => v[0]);
    }
}
