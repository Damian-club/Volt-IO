import Component from "./Component";
import Node from "../nodes/Node";

export default class MOSFET extends Component {
    private _k: number;  
    private _Vth: number;
    private _Vgs: number;
    private _Vds: number;

    constructor(
        name: string,
        nodeArray: Node[],
        k = 1e-3,
        Vth = 1
    ) {
        super(name, nodeArray);
        this._k = k;
        this._Vth = Vth;
        this._Vgs = 0;
        this._Vds = 0;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>): void {
        const [n1, n2, n3] = this.nodeArray.map(n => n.master);
        const d = nodeIndexMap.get(n1?.master ?? n1);
        const g = nodeIndexMap.get(n2?.master ?? n2);
        const s = nodeIndexMap.get(n3?.master ?? n3);
        if (d === undefined || g === undefined || s === undefined) return;

        const Vgs = this._Vgs;
        const Vds = this._Vds;

        let Id = 0, Gds = 0, Gm = 0;

        if (Vgs <= this._Vth) {
            Id = 0; Gds = 0; Gm = 0; 
        } else if (Vds < Vgs - this._Vth) {
          
            Gm = this._k * Vds;
            Gds = this._k * (Vgs - this._Vth - Vds);
            Id = this._k * ((Vgs - this._Vth) * Vds - 0.5 * Vds * Vds);
        } else {
          
            Gm = this._k * (Vgs - this._Vth);
            Gds = 1e-12; 
            Id = 0.5 * this._k * (Vgs - this._Vth) ** 2;
        }

       
        M[d][d] += Gds;
        M[d][s] -= Gds + Gm;
        M[d][g] += Gm;

        M[s][d] -= Gds;
        M[s][s] += Gds + Gm;
        M[s][g] -= Gm;

        b[d] -= Id - Gds * Vds - Gm * Vgs;
        b[s] += Id - Gds * Vds - Gm * Vgs;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const [n1, n2, n3] = this.nodeArray.map(n => n.master);
        const d = nodeIndexMap.get(n1?.master ?? n1);
        const g = nodeIndexMap.get(n2?.master ?? n2);
        const s = nodeIndexMap.get(n3?.master ?? n3);
        if (d === undefined || g === undefined || s === undefined) return;

        this._Vgs = voltages[g] - voltages[s];
        this._Vds = voltages[d] - voltages[s];
    }
}
