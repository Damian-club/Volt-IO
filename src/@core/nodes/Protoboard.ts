import Node from "./Node";

export default class Protoboard {
    private _rows: Node[];
    private _rails: { [name: string]: Node };
    private _name: string;

    constructor(name: string, rowCount: number, rails: string[] = ["VCC", "GND"]) {
        this._name = name;

       
        this._rows = Array.from({ length: rowCount }, (_, i) => new Node());

      
        this._rails = {};
        for (const rail of rails) {
            this._rails[rail] = new Node();
        }
    }

 
    get rows(): Node[] {
        return this._rows;
    }

  
    get rails(): { [name: string]: Node } {
        return this._rails;
    }

   
  
  
    
    
    connect(pin: Node, target: number | string): void {
        let nodeToConnect: Node;

        if (typeof target === "number") {
            if (target < 0 || target >= this._rows.length) {
                throw new Error(`Row index ${target} out of bounds`);
            }
            nodeToConnect = this._rows[target];
        } else {
            if (!(target in this._rails)) {
                throw new Error(`Rail ${target} does not exist`);
            }
            nodeToConnect = this._rails[target];
        }


        pin.mergeWith(nodeToConnect);
    }

    connectMultiple(pins: Node[], target: number | string) {
        for (const pin of pins) {
            this.connect(pin, target);
        }
    }
}