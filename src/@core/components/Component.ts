import Node from "../nodes/Node";

export default abstract class Component {
    protected _name: string;
    protected _nodeArray: Node[];

    constructor(name: string, nodeArray: Node[]) {
        this._name = name;
        this._nodeArray = nodeArray;
    }

    get name(): string { return this._name; }
    get nodeArray(): Node[] { return this._nodeArray; }

    abstract stamp(
        M: number[][],
        b: number[],
        nodeIndexMap: Map<Node, number>,
        dt?: number
    ): void;

    update?(
        nodeIndexMap: Map<Node, number>,
        voltages: number[]
    ): void;
}
