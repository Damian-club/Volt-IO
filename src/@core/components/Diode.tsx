import Component from "./Component";
import Node from "../nodes/Node";

export default class Diode extends Component {
    private _Is: number; 
    private _n: number; 
    private _Vt: number; 
    private _Vd: number;  

    constructor(name: string, nodeArray: Node[], Is = 1e-12, n = 1, Vt = 0.026) {
        super(name, nodeArray);
        this._Is = Is;
        this._n = n;
        this._Vt = Vt;
        this._Vd = 0;
    }

    stamp(
        M: number[][],
        b: number[],
        nodeIndexMap: Map<Node, number>,
        dt?: number
    ): void {
        const [node1, node2] = this.nodeArray.map(n => n.master);
        const n1 = nodeIndexMap.get(node1?.master ?? node1);
        const n2 = nodeIndexMap.get(node2?.master ?? node2);
        if (n1 === undefined || n2 === undefined) return;

        const G = (this._Is / (this._n * this._Vt)) * Math.exp(this._Vd / (this._n * this._Vt));
        const Ieq = this._Is * (Math.exp(this._Vd / (this._n * this._Vt)) - 1) - G * this._Vd;

        M[n1][n1] += G;
        M[n2][n2] += G;
        M[n1][n2] -= G;
        M[n2][n1] -= G;

        b[n1] -= Ieq;
        b[n2] += Ieq;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const [node1, node2] = this.nodeArray.map(n => n.master);
        const n1 = nodeIndexMap.get(node1?.master ?? node1);
        const n2 = nodeIndexMap.get(node2?.master ?? node2);
        if (n1 === undefined || n2 === undefined) return;

        this._Vd = voltages[n1] - voltages[n2];
    }
}