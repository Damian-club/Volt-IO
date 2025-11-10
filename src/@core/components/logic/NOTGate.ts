import LogicGate from "./LogicGate";

export default class NOTGate extends LogicGate {
    protected compute(inputs: boolean[]): boolean {
        return !inputs[0];
    }
}
