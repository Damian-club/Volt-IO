import Component from "./Component";
import Node from "../nodes/Node";

export default class Relay extends Component {
    private _coilR: number;    
    private _coilL: number;     
    private _threshold: number; 
    private _switchClosed: boolean = false;
    private _Icoil: number = 0;  

    constructor(
        name: string,
        coilNodes: Node[],
        switchNodes: Node[],
        coilR = 10,
        coilL = 0.01,
        threshold = 0.05
    ) {
        super(name, [...coilNodes, ...switchNodes]);
        this._coilR = coilR;
        this._coilL = coilL;
        this._threshold = threshold;
    }

    stamp(
        M: number[][],
        b: number[],
        nodeIndexMap: Map<Node, number>,
        dt = 1e-3
    ): void {
        const coilPos = nodeIndexMap.get(this.nodeArray[0].master);
        const coilNeg = nodeIndexMap.get(this.nodeArray[1].master);
        const swPos = nodeIndexMap.get(this.nodeArray[2].master);
        const swNeg = nodeIndexMap.get(this.nodeArray[3].master);

        if (coilPos === undefined || coilNeg === undefined) return;

      
        const Gcoil = 1 / (this._coilR + this._coilL / dt);
        const IeqCoil = this._Icoil * this._coilL / dt;

        M[coilPos][coilPos] += Gcoil;
        M[coilNeg][coilNeg] += Gcoil;
        M[coilPos][coilNeg] -= Gcoil;
        M[coilNeg][coilPos] -= Gcoil;

        b[coilPos] -= IeqCoil;
        b[coilNeg] += IeqCoil;

     
        if (swPos !== undefined && swNeg !== undefined) {
            const Gswitch = this._switchClosed ? 1e6 : 1e-12;
            M[swPos][swPos] += Gswitch;
            M[swNeg][swNeg] += Gswitch;
            M[swPos][swNeg] -= Gswitch;
            M[swNeg][swPos] -= Gswitch;
        }
    }

    update(nodeIndexMap: Map<Node, number>, voltages: number[], dt = 1e-3): void {
        const coilPos = nodeIndexMap.get(this.nodeArray[0].master);
        const coilNeg = nodeIndexMap.get(this.nodeArray[1].master);
        if (coilPos === undefined || coilNeg === undefined) return;

        const Vcoil = voltages[coilPos] - voltages[coilNeg];
        this._Icoil = Vcoil / this._coilR; 

       
        this._switchClosed = Math.abs(this._Icoil) >= this._threshold;
    }
}
