import Component from "./Component";
import Node from "../nodes/Node";

export default class Capacitor extends Component {
    private _cap: number;
    private _prevVoltage: number = 0;

    constructor(name: string, nodeArray: Node[], cap: number) {
        super(name, nodeArray);
        this._cap = cap;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>, dt: number) {
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const G = this._cap / dt;
        const I = G * this._prevVoltage;

        const i1 = nodeIndexMap.get(n1?.master ?? n1) ?? -1;
        const i2 = nodeIndexMap.get(n2?.master ?? n2) ?? -1;

        if (i1 !== -1) M[i1][i1] += G;
        if (i2 !== -1) M[i2][i2] += G;
        if (i1 !== -1 && i2 !== -1) {
            M[i1][i2] -= G;
            M[i2][i1] -= G;
        }

        if (i1 !== -1) b[i1] += I;
        if (i2 !== -1) b[i2] -= I;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]) {
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const i1 = nodeIndexMap.get(n1?.master ?? n1) ?? -1;
        const i2 = nodeIndexMap.get(n2?.master ?? n2) ?? -1;

        const v1 = i1 !== -1 ? voltages[i1] : 0;
        const v2 = i2 !== -1 ? voltages[i2] : 0;

        this._prevVoltage = v1 - v2;
    }
}
