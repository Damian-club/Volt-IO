import Component from "./Component";
import Node from "../nodes/Node";

export type VoltageMode = "DC" | "AC";

export default class VoltageSource extends Component {
    mode: VoltageMode;
    Vdc: number;      
    Vac: number;     
    freq?: number;   
    period?: number; 
    phase: number;    
    index: number;

    constructor(
        name: string,
        nodeArray: Node[],
        options: {
            mode?: VoltageMode,
            Vdc?: number,
            Vac?: number,
            freq?: number,
            period?: number,
            phase?: number,
            index?: number
        } = {}
    ) {
        super(name, nodeArray);
        this.mode = options.mode ?? "DC";
        this.Vdc = options.Vdc ?? 0;
        this.Vac = options.Vac ?? 0;
        this.freq = options.freq;
        this.period = options.period;
        this.phase = options.phase ?? 0;
        this.index = options.index ?? -1;

        if (!this.freq && this.period) {
            this.freq = 1 / this.period;
        }
    }

    stamp(M: number[][], b: number[], nodeIndexMap: Map<Node, number>, t: number = 0) {
        const [n1, n2] = this.nodeArray.map(n => n.master);
        const idx = this.index;

        const i1 = nodeIndexMap.get(n1?.master ?? n1) ?? -1;
        const i2 = nodeIndexMap.get(n2?.master ?? n2) ?? -1;

        if (i1 !== -1) {
            M[i1][idx] += 1;
            M[idx][i1] += 1;
        }
        if (i2 !== -1) {
            M[i2][idx] -= 1;
            M[idx][i2] -= 1;
        }

      
        let V = this.Vdc;
        if (this.mode === "AC" && this.freq) {
            V += this.Vac * Math.sin(2 * Math.PI * this.freq * t + this.phase);
        }

        b[idx] = V;
    }
}
