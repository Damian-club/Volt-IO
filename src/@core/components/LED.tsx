import Component from "./Component";
import Node from "../nodes/Node";

export default class LED extends Component {
    private _forwardVoltage: number;
    private _Vd: number = 0;

    constructor(name: string, nodeArray: Node[], forwardVoltage: number = 2.0) {
        super(name, nodeArray);
        this._forwardVoltage = forwardVoltage;
    }

    stamp(
        M: number[][],
        b: number[],
        nodeIndexMap: Map<Node, number>,
        dt?: number
    ): void {
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const i1 = nodeIndexMap.get(n1?.master ?? n1) ?? -1;
        const i2 = nodeIndexMap.get(n2?.master ?? n2) ?? -1;

        if (i1 === -1 || i2 === -1) return;

        // LED modeled as diode with forward voltage
        const Is = 1e-12;
        const n = 1;
        const Vt = 0.026;
        
        // Use Newton-Raphson for LED behavior
        const G = (Is / (n * Vt)) * Math.exp(this._Vd / (n * Vt));
        const Ieq = Is * (Math.exp(this._Vd / (n * Vt)) - 1) - G * this._Vd;

        M[i1][i1] += G;
        M[i2][i2] += G;
        M[i1][i2] -= G;
        M[i2][i1] -= G;

        b[i1] -= Ieq;
        b[i2] += Ieq;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const i1 = nodeIndexMap.get(n1?.master ?? n1) ?? -1;
        const i2 = nodeIndexMap.get(n2?.master ?? n2) ?? -1;

        if (i1 !== -1 && i2 !== -1) {
            this._Vd = voltages[i1] - voltages[i2];
        }
    }

    get voltage(): number {
        return this._Vd;
    }

    get isLit(): boolean {
        return this._Vd > this._forwardVoltage * 0.8;
    }
}

