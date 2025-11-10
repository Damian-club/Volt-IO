import Component from "../Component";
import Node from "../../nodes/Node";

export default abstract class LogicGate extends Component {
    protected _inputNodes: Node[];
    protected _outputNode: Node;
    protected _highVoltage: number;
    protected _lowVoltage: number;
    protected _threshold: number;

    constructor(
        name: string,
        inputNodes: Node[],
        outputNode: Node,
        highVoltage = 5,
        lowVoltage = 0,
        threshold = 2.5
    ) {
        super(name, [...inputNodes, outputNode]);
        this._inputNodes = inputNodes;
        this._outputNode = outputNode;
        this._highVoltage = highVoltage;
        this._lowVoltage = lowVoltage;
        this._threshold = threshold;
    }

    protected abstract compute(inputs: boolean[]): boolean;

    update(nodeIndexMap: Map<Node, number>, voltages: number[]): void {
        const inputValues = this._inputNodes.map(
            (n) => (voltages[nodeIndexMap.get(n.master)!] ?? 0) >= this._threshold
        );
        const outputValue = this.compute(inputValues);
        const outIndex = nodeIndexMap.get(this._outputNode.master)!;
        voltages[outIndex] = outputValue ? this._highVoltage : this._lowVoltage;
    }


    stamp(): void {
        
    }
}
