import LogicGate from "./LogicGate";

export default class XORGate extends LogicGate {
    protected compute(inputs: boolean[]): boolean {
        return inputs.filter(Boolean).length % 2 === 1;
    }
}
