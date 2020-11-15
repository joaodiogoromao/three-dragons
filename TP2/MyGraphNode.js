/**
 * Saves a node's information, like texture, material, transformations and scale factors (afs and aft)
 * @constructor
 * @param {String} id - the id of the node
 * @param {XMLscene} scene - reference to the XMLscene Object
 */
class Node extends CGFobject {
    constructor(id, scene) {
        super(scene);

        this.id = id;
        this.descendantIds = [];
        this.descendantObjs = [];

        this.material = null;
        this.texture = null;
        this.animation = null;

        this.transformationMatrix = null;

        this.scaleFactors = {
            afs: 1,
            aft: 1
        };
    }

    /**
     * @param {CGFtexture} texture 
     */
    setTexture(texture) {
        this.texture = texture;
    }

    /**
     * @param {CGFappearance} material 
     */
    setMaterial(material) {
        this.material = material;
    }

    /**
     * @param {Animation} animation 
     */
    setAnimation(animation) {
        this.animation = animation;
    }

    /**
     * @param {mat4} transformationMatrix 
     */
    setTransformationMatrix(transformationMatrix) {
        this.transformationMatrix = transformationMatrix;
    }

    /**
     * @param {Object with afs and aft attributes} scaleFactors 
     */
    setScaleFactors(scaleFactors){
        this.scaleFactors = {...scaleFactors};
    }

    /**
     * Adds a descendant's id
     * @param {string} id id of the descendant node 
     */
    addDescendantId(id) {
        this.descendantIds.push(id);
    }

    /**
     * Adds a descendant's object
     * @param {Node} obj the descendant object
     */
    addDescendantObj(obj) {
        this.descendantObjs.push(obj);
    }

    /**
     * Corresponds the ids in descendantIds to real objects
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

    update(timeSinceProgramStarted) {
        if (this.animation != null) this.animation.update(timeSinceProgramStarted);
        for(const desc of this.descendantObjs) {
            if (desc.obj instanceof MySpriteAnimation) desc.obj.update(timeSinceProgramStarted);
        }
    }

    /**
     * Draws the node and all its descendants
     */
    display() {
        this.scene.pushMatrix();
        this.scene.pushMaterial();
        this.scene.pushTexture();

        if (this.material != null && this.material != "null") { // applies the material if it exists
            this.scene.setMaterial(this.material);
        }
        if (this.texture !== null && this.texture !== "null" && this.texture !== "clear") { // applies the texture if it exists
            this.scene.setTexture(this.texture);
        } else if (this.texture === "clear") { // clears the texture
            this.scene.setTexture(null);
        }
        if (this.transformationMatrix != null)  // applies transformations if they exist
            this.scene.multMatrix(this.transformationMatrix);
        
        let go = true;
        if (this.animation != null)  //applies animations if it is defined
            go = this.animation.apply(this.scene);
        
        if (go) {
            // DRAWS THE DESCENDANTS
            for (const desc of this.descendantObjs) {
                desc.display(this.scaleFactors);
            }
        }

        
        this.scene.popMaterial();
        this.scene.popTexture();
        this.scene.popMatrix();
    }
}

/**
 * LeafNode (for leaves)
 * @constructor
 * @param {CGFobject} obj the leaf object
 */
class LeafNode extends CGFobject {
    
    constructor(scene, obj) {
        super(scene);
        this.obj = obj;
    }

    display(scaleFactors) {
        if (this.obj instanceof MyRectangle || this.obj instanceof MyTriangle) {
            this.obj.updateTexCoords(scaleFactors);
        }
        this.obj.display();
    }
}

