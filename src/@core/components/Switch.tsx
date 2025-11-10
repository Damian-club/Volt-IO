import Component from "./Component";
import Node from "../nodes/Node";

export default class Switch extends Component {
    private _closed: boolean;

    constructor(name: string, nodeArray: Node[], closed: boolean = false) {
        super(name, nodeArray);
        this._closed = closed;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>) {
        const R = this._closed ? 1e-3 : 1e9;
        const g = 1 / R;

        const [n1, n2] = this.nodeArray;
        const i1 = nodeIndexMap.get(n1) ?? -1;
        const i2 = nodeIndexMap.get(n2) ?? -1;

        if (i1 !== -1) M[i1][i1] += g;
        if (i2 !== -1) M[i2][i2] += g;
        if (i1 !== -1 && i2 !== -1) {
            M[i1][i2] -= g;
            M[i2][i1] -= g;
        }
    }

    toggle() { this._closed = !this._closed; }
}
