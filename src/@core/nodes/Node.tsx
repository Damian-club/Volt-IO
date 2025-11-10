export default class Node {
    voltage: number | null = null;
    private _master: Node | null = null;

    mergeWith(other: Node) {
        this._master = other;
    }

    get master(): Node {
        return this._master?.master ?? this;
    }
}
