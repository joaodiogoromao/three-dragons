/**
 * This class seems quite useless right now, but I think it will be useful for the textures, materials and transformations
 */
class Node extends CGFobject {
    constructor(scene) {
        super(scene);
        this.texture = null;
        this.material = null;
        this.transformationMatrix = null;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setMaterial(material) {
        this.material = material;
    }

    setTransformationMatrix(transformationMatrix) {
        this.transformationMatrix = transformationMatrix;
    }

    display(displayFunction) {
        this.scene.pushMatrix();

        if (this.transformationMatrix != null)
            this.scene.multMatrix(this.transformationMatrix);
        displayFunction();

        this.scene.popMatrix();
    }
}


class IntermediateNode extends Node {
    constructor(scene) {
        super(scene);
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
        const displayFunc = function() {
            for (let desc of this.descendantObjs) desc.display();
        }
        super.display(displayFunc.bind(this));
    }
}

class LeafNode extends Node {
    
    /**
     * @param {CGFobject} obj the leaf object
     */
    constructor(scene, obj) {
        super(scene);
        this.obj = obj;
    }

    display() {
        const displayFunc = function() {
            this.obj.display();
        }
        super.display(displayFunc.bind(this));
    }
}

