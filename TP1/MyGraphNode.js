/**
 * This class seems quite useless right now, but I think it will be useful for the textures, materials and transformations
 */
class Node {
}


class IntermediateNode extends Node {
    constructor() {
        super();
        this.descendantIds = [];
        this.descendantObjs = [];
    }

    /**
     * @param {string} id id of the descendant node 
     */
    addDescendantId(id) {
        this.descendantIds.push(id);
    }

    /**
     * @param {Node} obj the descendant object
     */
    addDescendantObj(obj) {
        this.descendantObjs.push(obj);
    }

    /**
     * @param {array} array that maps ids to objects
     */
    correspondIdsToObjects(objMap) {
        let res = [];
        for (let id of this.descendantIds) {
            const obj = objMap[id];
            if (obj != undefined) {
                this.addDescendantObj(obj);
            } else {
                res.push(id);
            }
        }
        return res;
    }

    display() {
        for (let desc of this.descendantObjs) desc.display();
    }
}

class LeafNode extends Node {
    
    /**
     * 
     * @param {CGFObject} obj the leaf object
     */
    constructor(obj) {
        super();
        this.obj = obj;
    }

    display() {
        this.obj.display();
    }
}

