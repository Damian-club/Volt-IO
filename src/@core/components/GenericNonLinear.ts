import Component from "./Component";
import Node from "../nodes/Node";

type IVFunction = (v: number) => number;
type ConductanceFunction = (v: number) => number;

export default class GenericNonlinearComponent extends Component {
    private _I: IVFunction;
    private _G: ConductanceFunction;
    private _V: number = 0;
    public isBroken: boolean = false;

    private _Vmax?: number;
    private _Imax?: number;

    constructor(
        name: string,
        nodeArray: Node[],
        I: IVFunction,
        G: ConductanceFunction,
        Vmax?: number,
        Imax?: number
    ) {
        super(name, nodeArray);
        this._I = I;
        this._G = G;
        this._Vmax = Vmax;
        this._Imax = Imax;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>): void {
        if (this.isBroken) return; // behaves like open circuit

        const n1 = nodeIndexMap.get(this.nodeArray[0]);
        const n2 = nodeIndexMap.get(this.nodeArray[1]);
        if (n1 === undefined || n2 === undefined) return;

        const Ieq = this._I(this._V) - this._G(this._V) * this._V;
        const G = this._G(this._V);

        M[n1][n1] += G;
        M[n2][n2] += G;
        M[n1][n2] -= G;
        M[n2][n1] -= G;

        b[n1] -= Ieq;
        b[n2] += Ieq;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const n1 = nodeIndexMap.get(this.nodeArray[0]);
        const n2 = nodeIndexMap.get(this.nodeArray[1]);
        if (n1 === undefined || n2 === undefined) return;

        this._V = voltages[n1] - voltages[n2];

        const current = this._I(this._V);
        if ((this._Vmax !== undefined && Math.abs(this._V) > this._Vmax) ||
            (this._Imax !== undefined && Math.abs(current) > this._Imax)) {
            this.isBroken = true;
            console.warn(`${this.name} has broken! V=${this._V.toFixed(2)}, I=${current.toFixed(2)}`);
        }
    }
}
