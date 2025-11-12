import Component from "./Component";
import Node from "../nodes/Node";

export default class BJT extends Component {
    private _Is: number;    
    private _Vt: number;   
    private _alphaF: number; 
    private _alphaR: number; 
    private _Vbe: number;   
    private _Vbc: number;

    constructor(
        name: string,
        nodeArray: Node[],
        Is = 1e-15,
        Vt = 0.026,
        alphaF = 0.99,
        alphaR = 0.5
    ) {
        super(name, nodeArray);
        this._Is = Is;
        this._Vt = Vt;
        this._alphaF = alphaF;
        this._alphaR = alphaR;
        this._Vbe = 0;
        this._Vbc = 0;
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>): void {
        const [n1, n2, n3] = this.nodeArray.map(n => n.master);
        const c = nodeIndexMap.get(n1?.master ?? n1);
        const bNode = nodeIndexMap.get(n2?.master ?? n2);
        const e = nodeIndexMap.get(n3?.master ?? n3);
        if (c === undefined || bNode === undefined || e === undefined) return;

        const expVbe = Math.exp(this._Vbe / this._Vt);
        const expVbc = Math.exp(this._Vbc / this._Vt);

      
        const Gbe = this._Is / this._Vt * expVbe;
        const Gbc = this._Is / this._Vt * expVbc;

     
        const Ibe = this._Is * (expVbe - 1) - Gbe * this._Vbe;
        const Ibc = this._Is * (expVbc - 1) - Gbc * this._Vbc;

       
       
        M[c][c] += Gbc + this._alphaF * Gbe;
        M[c][bNode] += -(Gbc + this._alphaF * Gbe);
        M[c][e] += -this._alphaF * Gbe;

    
        M[bNode][c] += -Gbc + (1 - this._alphaF) * Gbe;
        M[bNode][bNode] += Gbc + (1 - this._alphaF) * Gbe;
        M[bNode][e] += -(1 - this._alphaF) * Gbe;

      
        M[e][c] += -this._alphaR * Gbc;
        M[e][bNode] += - (1 - this._alphaR) * Gbc + this._alphaR * Gbc;
        M[e][e] += Gbe + (1 - this._alphaR) * Gbc;

        b[c] -= Ibc - this._alphaF * Ibe;
        b[bNode] -= -Ibc + (1 - this._alphaF) * Ibe;
        b[e] -= Ibe + (1 - this._alphaR) * Ibc;
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const [n1, n2, n3] = this.nodeArray.map(n => n.master);
        const c = nodeIndexMap.get(n1?.master ?? n1);
        const bNode = nodeIndexMap.get(n2?.master ?? n2);
        const e = nodeIndexMap.get(n3?.master ?? n3);
        if (c === undefined || bNode === undefined || e === undefined) return;

        this._Vbe = voltages[bNode] - voltages[e];
        this._Vbc = voltages[bNode] - voltages[c];
    }
}
