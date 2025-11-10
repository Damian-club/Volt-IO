import Component from "./Component";
import Node from "../nodes/Node";

export default class Potentiometer extends Component {
    private _resistance: number; 
    private _position: number; 

    constructor(
        name: string,
        nodeArray: Node[],
        resistance: number = 10000, 
        position: number = 0.5       
    ) {
        if (nodeArray.length !== 3) {
            throw new Error("Potentiometer requires 3 nodes: terminal1, wiper, terminal3");
        }
        super(name, nodeArray);
        this._resistance = resistance;
        this._position = position;
    }

   
    setPosition(pos: number) {
        this._position = Math.max(0, Math.min(1, pos));
    }

   
    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>) {
        const n1 = nodeIndexMap.get(this.nodeArray[0].master);
        const nw = nodeIndexMap.get(this.nodeArray[1].master);
        const n3 = nodeIndexMap.get(this.nodeArray[2].master);
        if (n1 === undefined || nw === undefined || n3 === undefined) return;

      
        const R1 = this._resistance * this._position;      
        const R2 = this._resistance * (1 - this._position);

        const G1 = 1 / R1;
        const G2 = 1 / R2;

       
        M[n1][n1] += G1;
        M[nw][nw] += G1;
        M[n1][nw] -= G1;
        M[nw][n1] -= G1;

       
        M[nw][nw] += G2;
        M[n3][n3] += G2;
        M[nw][n3] -= G2;
        M[n3][nw] -= G2;
    }
}
