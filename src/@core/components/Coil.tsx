import Component from "./Component";
import Node from "../nodes/Node";

export default class Coil extends Component {
    private _L: number; 
    private _I: number = 0;

    constructor(name: string, nodeArray: Node[], L: number = 0.01) {
        super(name, nodeArray);
        this._L = L;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>, dt = 1e-3): void {
        const n1 = nodeIndexMap.get(this.nodeArray[0].master);
        const n2 = nodeIndexMap.get(this.nodeArray[1].master);
        if (n1 === undefined || n2 === undefined) return;

        const G = dt / this._L;
        const Ieq = this._I;

        M[n1][n1] += G;
        M[n2][n2] += G;
        M[n1][n2] -= G;
        M[n2][n1] -= G;

        b[n1] -= Ieq;
        b[n2] += Ieq;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[], dt = 1e-3): void {
        const n1 = nodeIndexMap.get(this.nodeArray[0].master);
        const n2 = nodeIndexMap.get(this.nodeArray[1].master);
        if (n1 === undefined || n2 === undefined) return;

        const V = voltages[n1] - voltages[n2];
        this._I += dt / this._L * V;
    }
}
