import LogicGate from "./LogicGate";

export default class ANDGate extends LogicGate {
    protected compute(inputs: boolean[]): boolean {
        return inputs.every(Boolean);
    }
}
