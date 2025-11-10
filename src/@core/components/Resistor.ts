import Component from "./Component";
import Node from "../nodes/Node";

export default class Resistor extends Component {
    private _value: number;

    constructor(name: string, nodeArray: Node[], value: number) {
        super(name, nodeArray);
        this._value = value;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>) {
   
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const g = 1 / this._value;

        const i1 = nodeIndexMap.get(n1) ?? -1;
        const i2 = nodeIndexMap.get(n2) ?? -1;

        if (i1 !== -1) M[i1][i1] += g;
        if (i2 !== -1) M[i2][i2] += g;
        if (i1 !== -1 && i2 !== -1) {
            M[i1][i2] -= g;
            M[i2][i1] -= g;
        }
    }
}