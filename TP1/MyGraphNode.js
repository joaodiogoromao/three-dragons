/**
 * This class seems quite useless right now, but I think it will be useful for the textures, materials and transformations
 */
class Node extends CGFobject {
    constructor(scene) {
        super(scene);
        this.texture = null;
        this.material = null;
        this.transformationMatrix = null;
        this.scaleFactors = {
            afs: 1,
            aft: 1
        };
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

    setScaleFactors(scaleFactors){
        this.scaleFactors = {...scaleFactors};

        console.log("set scaleFactors", scaleFactors, this.scaleFactors);
    }

    display(displayFunction) {
        this.scene.pushMatrix();
        this.scene.pushMaterial();
        this.scene.pushTexture();

        if (this.material != null && this.material != "null") {
            this.scene.setMaterial(this.material);
        }
        if (this.texture !== null && this.texture !== "null" && this.texture !== "clear") {
            this.scene.setTexture(this.texture);
        } else if (this.texture === "clear") { // CLEARs the texture
            //console.log("CLEAR texture");
            this.scene.setTexture(null);
        }
        if (this.transformationMatrix != null)
            this.scene.multMatrix(this.transformationMatrix);
        displayFunction();

        
        this.scene.popMaterial();
        this.scene.popTexture();
        this.scene.popMatrix();
    }
}


class IntermediateNode extends Node {
    constructor(id, scene) {
        super(scene);
        this.id = id;
        this.descendantIds = [];
        this.descendantObjs = [];
        this.material = null;
        this.texture = null;
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
            for (const desc of this.descendantObjs) {
                desc.display(this.scaleFactors);
            }
            
        }
        super.display(displayFunc.bind(this));
    }
}

class LeafNode extends CGFobject {
    
    /**
     * @param {CGFobject} obj the leaf object
     */
    constructor(scene, obj) {
        super(scene);
        this.obj = obj;
    }

    display(scaleFactors) {
        if (this.obj instanceof MyRectangle || this.obj instanceof MyTriangle) {
            //console.log(scaleFactors);
            this.obj.updateTexCoords(scaleFactors);
        }
        this.obj.display();
    }
}

