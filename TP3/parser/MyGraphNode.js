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
        for (let obj of this.descendantObjs) {
            if (obj instanceof LeafNode && obj.obj instanceof MyBoard) {
                obj.obj.correspondIdsToObjects(objMap);
            }
        }

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

    /**
     * @method update
     * Calls method update of every node that has an animation.
     * Calls method update for every MySpriteAnimation object.
     * @param {Number} timeSinceProgramStarted 
     */
    update(timeSinceProgramStarted) {
        if (this.animation != null) this.animation.update(timeSinceProgramStarted); // updates the node's animation if it exists
        for(const desc of this.descendantObjs) { // updates each of node's children
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
        
        if (go) { // if the animation hasn't started yet, the object doesn't appear
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

    /**
     * @method display
     * Displays the LeafNode, calling @method updateTextCoord if object is an instance of MyRectangle, MyTriangle or MyPlane in order to represent associated textures with correct scale factors.
     * @param {Object} scaleFactors - object containing scale factors properties.
     */
    display(scaleFactors) {
        if (this.obj instanceof MyRectangle || this.obj instanceof MyTriangle || this.obj instanceof MyPlane) {
            this.obj.updateTexCoords(scaleFactors);
        }
        this.obj.display();
    }
}

