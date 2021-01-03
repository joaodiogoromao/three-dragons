const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

const isNotNull = (v) => v != null;
const isNull = (v) => v === null;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    static types = {
        MODULE: 0,
        SCENE: 1,
        GAME: 2
    };

    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene, type, filesLength) {
        this.loadedOk = null;
        this.filesLength = filesLength;

        this.scene = scene;

        this.nodes = [];
        this.materials = [];
        this.textures = [];
        this.cameras = [];
        this.spritesheets = [];

        this.idRoot = null; // The id of the root element.
        this.objRoot = null;
        this.board = null;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);

        // Scene type (to distinguish if only object nodes need to be parsed)
        this.type = type;
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        const rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        const error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }
        
        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place

        this.scene.onGraphLoaded(this.type, this, this.filesLength);

        this.loadedOk = true;
    }

    initCameras() {
        const rootElement = this.reader.xmlDoc.documentElement;
        const nodes = rootElement.children;
        const nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let index, error;
        if ((index = nodeNames.indexOf("views")) == -1)
            this.onXMLMinorError("tag <views> missing");
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        const nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        const nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let error, index;

        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // graph only needs views, illumination and lights if it's a scene
        //if (this.type == MySceneGraph.types.SCENE) {

            // <illumination>
            if ((index = nodeNames.indexOf("illumination")) == -1)
                this.onXMLMinorError("Tag <illumination> missing");
            else {
                if (index != ILLUMINATION_INDEX)
                    this.onXMLMinorError("tag <illumination> out of order");

                //Parse illumination block
                if ((error = this.parseIllumination(nodes[index])) != null)
                    return error;
            }

            // <lights>
            if ((index = nodeNames.indexOf("lights")) == -1)
                this.onXMLMinorError("Tag <lights> missing");
            else {
                if (index != LIGHTS_INDEX)
                    this.onXMLMinorError("tag <lights> out of order");

                //Parse lights block
                if ((error = this.parseLights(nodes[index])) != null)
                    return error;
            }
        //}

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        let id;
        // Get root of the scene.
        if(rootIndex != -1) {
            const rootNode = children[rootIndex];
            id = this.reader.getString(rootNode, 'id');
        }
        if (rootIndex == -1 || isNull(id)) {
            this.onXMLMinorError("No root id defined for scene. Using the first defined node.");
        }

        this.idRoot = id;

        // Get axis length       
        let axis_length; 
        if(referenceIndex == -1) {
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");
            axis_length = 1;
        } else {
            var refNode = children[referenceIndex];
            axis_length = this.reader.getFloat(refNode, 'length');
            if (axis_length == null) {
                this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");
                axis_length = 1;
            }
        }

        this.referenceLength = axis_length;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        const children = viewsNode.children;
        const defaultCameraId = this.reader.getString(viewsNode, 'default');
        if (isNull(defaultCameraId)) {
            this.onXMLMinorError("No default camera id given. Using the first defined one.");
        }

        for (let child of children) {
            if (child.nodeName !== "perspective" && child.nodeName !== "ortho") {
                this.onXMLMinorError(`Invalid nodeName '${child.nodeName}' in child${this.getIDErrorMessage(child)} of 'views' node.`);
                continue;
            }

            const grandChildren = child.children;

            const cameraId = this.getNodeID(child);
            if (isNull(cameraId)) continue;

            if (isNotNull(this.cameras[cameraId])) {
                this.onXMLMinorError("ID must be unique for each camera (conflict: ID = " + cameraId + "). Ignoring repeated ids.");
            }


            const cameraNF = this.getFloatParameters(child, ['near', 'far']);
            if (isNull(cameraNF)) continue;

            let toObj = null, fromObj = null;

            for (const grandChild of grandChildren) {
                if (grandChild.nodeName === "to" && isNull(toObj)) {
                    toObj = grandChild;
                } else if (grandChild.nodeName === "from" && isNull(fromObj)) {
                    fromObj = grandChild;
                } else if (grandChild.nodeName === "up") {
                    continue;
                } else {
                    this.onXMLMinorError("Duplicate or invalid node inside camera" + this.getIDErrorMessage(child));
                }
            }

            if (isNull(toObj) || isNull(fromObj)) {
                if (isNull(toObj)) {
                    this.onXMLMinorError("Didn't find a 'to' node inside camera" + this.getIDErrorMessage(child));
                } else {
                    this.onXMLMinorError("Didn't find a 'from' node inside camera" + this.getIDErrorMessage(child));
                }
                continue;
            }

            const xyz = ['x', 'y', 'z'];
            const cameraTo = this.getFloatParameters(toObj, xyz);
            const cameraFrom = this.getFloatParameters(fromObj, xyz);

            if (isNull(cameraTo) || isNull(cameraFrom)) continue;

            
            if (child.nodeName == "perspective") { // Parses perpective camera
                const cameraAngle = this.getFloatParameters(child, ['angle']);
                if (isNull(cameraAngle)) continue;

                this.scene.addCamera(cameraId, new CGFcamera(cameraAngle.angle * DEGREE_TO_RAD, cameraNF.near, cameraNF.far, vec3.fromValues(cameraFrom.x, cameraFrom.y, cameraFrom.z), vec3.fromValues(cameraTo.x, cameraTo.y, cameraTo.z)));
            
            } else if (child.nodeName == "ortho") { // parses ortho camera
                const cameraLRTB = this.getFloatParameters(child, ['left', 'right', 'top', 'bottom']);
                if (isNull(cameraLRTB)) continue;
                
                let upObj = null;

                for (const grandChild of grandChildren) {
                    if (grandChild.nodeName === "up" && isNull(upObj)) {
                        upObj = grandChild;
                        break;
                    }
                }
                let cameraUp = null;
                if (isNotNull(upObj)) cameraUp = this.getFloatParameters(upObj, xyz);
                
                if (isNull(cameraUp)) this.onXMLMinorError(`No 'up' node child inside ortho camera${this.getIDErrorMessage(child)}; using default [0, 1, 0].`);

                this.scene.addCamera(cameraId, new CGFcameraOrtho(cameraLRTB.left, cameraLRTB.right, cameraLRTB.bottom, cameraLRTB.top, cameraNF.near, cameraNF.far, vec3.fromValues(cameraFrom.x, cameraFrom.y, cameraFrom.z), vec3.fromValues(cameraTo.x, cameraTo.y, cameraTo.z), isNull(cameraUp) ? vec3.fromValues(0, 1, 0) : vec3.fromValues(cameraUp.x, cameraUp.y, cameraUp.z)));
            }
        }
            
        // Chooses the first defined camera
        if (isNull(defaultCameraId) || isNull(this.scene.cameras[defaultCameraId]) || this.scene.cameras[defaultCameraId] == undefined) {
            if (!isNull(defaultCameraId)) { // message for missing default camera id has already been logged
                this.onXMLMinorError(`There is no camera with id equal to the default ('${defaultCameraId}') camera id. Using the first defined one.`);
            }
            if (Object.keys(this.scene.cameras).length == 0) {
                this.onXMLMinorError("No cameras have been defined. Using a default.");
                return null;
            }
            //this.scene.selectedCamera = Object.keys(this.scene.cameras)[0];
            this.defaultCamera = this.scene.cameras[0];
            //this.scene.setSelectedCamera();
            return null;
        }


        this.defaultCamera = this.scene.cameras[defaultCameraId];
        //this.scene.selectedCamera = defaultCameraId;
        //this.scene.setSelectedCamera();
        this.log("Parsed Views");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");


        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color)) {
            this.onXMLMinorError(color);
            this.ambient = [0.2, 0.2, 0.2, 1];
        } else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color)) {
            this.onXMLMinorError(color);
            this.background = [0, 0, 0, 1];
        } else
            this.background = color;

        this.log("Parsed Illumination.");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) {
                this.onXMLMinorError("No ID defined for light.");
                continue;
            }

            // Checks for repeated IDs.
            if (this.lights[lightId] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + lightId + "). Ignoring repeated ids.");
                continue;
            }

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            let error = false;

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string') {
                        this.onXMLMinorError(aux);
                        error = true;
                        break;
                    }

                    global.push(aux);
                }
                else {
                    this.onXMLMinorError("light attribute '" + attributeNames[i] + "' undefined for light with id '" + lightId + "'.");
                    error = true;
                    break;
                }
            }
            if (error) continue;
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0) {
            this.onXMLMinorError("At least one light should be defined! Using a generic one.");
            this.lights['generic'] = [
                true,
                [0, 15, 0, 1],
                [0.5, 0.5, 0.5, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1]
            ]
            return null;
        }
        else if (numLights > 8)
            this.onXMLMinorError("Too many lights defined; WebGL imposes a limit of 8 lights.");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        //this.onXMLMinorError("To do: Parse textures.");
        var children = texturesNode.children;

        for (const tex of children) {

            if (tex.nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + tex.nodeName + "> inside 'textures' block.");
                continue;
            }

            // Get id of the current material.
            var textureID = this.getNodeID(tex);
            if (textureID == null) continue;

            // Checks for repeated IDs.
            if (isNotNull(this.textures[textureID])) {
                this.onXMLMinorError("ID must be unique for each texture (conflict: ID = " + textureID + "). Discarding the repeated");
                continue;
            } 

            //Continue here
            var path = this.reader.getString(tex, 'path');
            if (path == null) {
                this.onXMLMinorError(`No path defined for texture with id '${textureId}'.`);
            }
            
            const texture = new CGFtexture(this.scene, path);
            this.textures[textureID] = texture;

        }
        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spirtesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {
        var children = spritesheetsNode.children;

        for (const sprite of children) {

            if (sprite.nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + sprite.nodeName + "> inside 'spritesheets' block.");
                continue;
            }

            // Get id of the current material.
            var spriteID = this.getNodeID(sprite);
            if (spriteID == null) continue;

            // Checks for repeated IDs.
            if (isNotNull(this.spritesheets[spriteID])) {
                this.onXMLMinorError("ID must be unique for each spritesheet (conflict: ID = " + spriteID + "). Discarding the repeated");
                continue;
            } 

            // Gets path to spritesheet
            var path = this.reader.getString(sprite, 'path');
            if (path == null) {
                this.onXMLMinorError(`No path defined for spritesheet with id '${spriteID}'.`);
            }

            const params = ['sizeM', 'sizeN'];
            const res = this.getIntegerParameters(sprite, params);
            
            const spritesheet = new MySpriteSheet(this.scene, path, res.sizeM, res.sizeN);
            this.spritesheets[spriteID] = spritesheet;
        }
        this.log("Parsed spritesheets");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.getNodeID(children[i]);
            if (materialID == null) continue;

            // Checks for repeated IDs.
            if (this.materials[materialID] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + materialID + "). Ignoring materials with repeated ids.");
                continue;
            }

            //Continue here
            
            const material = new CGFappearance(this.scene);
            material.setTextureWrap('REPEAT', 'REPEAT');
            grandChildren = children[i].children;

            const parentObj = {
                id: materialID
            }
            
            const checkList = {};
            const childNodes = ["shininess", "ambient", "diffuse", "specular", "emissive"];
            for (const a of childNodes) checkList[a] = false;

            // Parses every rgba component of the material
            for (let child of grandChildren) {
                if (child.nodeName === "shininess") {
                    const res = this.getFloatParameters(child, ['value'], parentObj);
    
                    if (isNotNull(res)) {
                        material.setShininess(res);
                    }
                } else if (child.nodeName === "ambient") {
                    const params = ['r', 'g', 'b', 'a'];
        
                    const res = this.getFloatParameters(child, params, parentObj, 0, 1);
    
                    if (isNotNull(res)) {
                        material.setAmbient(res.r, res.g, res.b, res.a);
                    }
                } else if (child.nodeName === "diffuse") {    
                    
                    const params = ['r', 'g', 'b', 'a'];
        
                    const res = this.getFloatParameters(child, params, parentObj, 0, 1);
    
                    if (isNotNull(res)) {
                        material.setDiffuse(res.r, res.g, res.b, res.a);
                    }
                } else if (child.nodeName === "specular") {    
                    
                    const params = ['r', 'g', 'b', 'a'];
        
                    const res = this.getFloatParameters(child, params, parentObj, 0, 1);
    
                    if (isNotNull(res)) {
                        material.setSpecular(res.r, res.g, res.b, res.a);
                    }
                } else if (child.nodeName === "emissive") {    
                    
                    const params = ['r', 'g', 'b', 'a'];
        
                    const res = this.getFloatParameters(child, params, parentObj, 0, 1);
    
                    if (isNotNull(res)) {
                        material.setEmission(res.r, res.g, res.b, res.a);
                    }
                } else {
                    this.onXMLMinorError(`Child of 'material' node with id '${materialID}' has got an invalid nodeName ('${child.nodeName}').`);
                    continue;
                }
                checkList[child.nodeName] = true;
            }
            for (let a in checkList) {
                if (checkList[a] == false) {
                    this.onXMLMinorError(`Property '${a}' of material with id '${materialID}' is not defined.`);
                    break;
                }
            }
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode 
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        // Any number of nodes.
        for (let i = 0; i < children.length; i++){
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> inside 'nodes' block");
                continue;
            }

            // Get id of the current animation.
            let animationID = this.getNodeID(children[i]);
            if (animationID == null) continue;

            // Checks for repeated IDs.
            if (this.animations[animationID] != null) {
                this.onXMLMinorError("ID must be unique for each animation (conflict: ID = " + animationID + "). Ignoring animations with repeated ids.");
                continue;
            }

            // Parse animation replay
            let replay = false;
            if (children[i].attributes.replay != undefined){
                replay = this.parseBoolean(children[i], "replay");
            }

            // Parse keyframes
            this.animations[animationID] = new MyKeyframeAnimation(this.parseKeyframes(children[i].children), replay);
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * @method initTransformationObj
     * Populates an array given as parameter with objects containing the default values for each transformation associated with a keyframe
     * @param {Array<Object>} transformationObj 
     */
    initTransformationObj(transformationObj) {
        transformationObj['scale'] = { sx: 1, sy: 1, sz: 1 };
        transformationObj['translation'] = { x: 0, y: 0, z: 0 };
        transformationObj['rotationX'] = { angle: 0, axis: 'x' };
        transformationObj['rotationY'] = { angle: 0, axis: 'y' };
        transformationObj['rotationZ'] = { angle: 0, axis: 'z' };
    }

    /**
     * Parses the <keyframe> block.
     * Creates an array of Keyframe's, creating each keyframe with the associated instant and transformationObj, created with the @method initTransformationObj .
     * @param {keyframe block element} keyframeNode
     * @return {Array<Keyframe>} - array of Keyframe objects.
     */
    parseKeyframes(keyframeNode) {
        let keyframeArray = [];
        for (let keyframe of keyframeNode){
            const instant = this.getFloatParameters(keyframe, ['instant']);
            let transformationObj = {};

            this.initTransformationObj(transformationObj);  // this inits the object with default values so that keyframes without a certain transformation can also interpolate with next keyframe if it uses that transformation

            // parse each transformation in the keyframe block
            for (let transformation of keyframe.children){
                const transf = this.parseTransformation(transformation);
                transformationObj[transf.type] = transf.params;
            }
            keyframeArray.push(new Keyframe(instant.instant, transformationObj));
        }
        return keyframeArray;
    }
    

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> inside 'nodes' block");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.getNodeID(children[i]);
            if (nodeID == null) continue;

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null) {
                this.onXMLMinorError("ID must be unique for each node (conflict: ID = " + nodeID + "). Ignoring nodes with repeated ids.");
                continue;
            }

            this.nodes[nodeID] = this.parseNode(children[i]);
        }


        // ESTABLISHES CONNECTIONS BETWEEN REFERENCED IDS AND NODES
        let unmatchedIds = [];
        for (const n in this.nodes) {
            unmatchedIds = unmatchedIds.concat(this.nodes[n].correspondIdsToObjects(this.nodes, this.animations));
        }
        unmatchedIds = unmatchedIds.filter((val, idx, arr) => {
            return arr.indexOf(val) === idx;
        });          
        
        if (unmatchedIds.length) this.onXMLMinorError("The following ids are referenced but do not have a correspondent node: " + unmatchedIds.join());
    
        this.objRoot = isNotNull(this.idRoot) ? this.nodes[this.idRoot] : this.nodes[Object.keys(this.nodes)[0]];
        this.log("Parsed nodes");
    }

    /**
     * Parses a given <node> block
     * @param {node block element} nodeBlock
     * @return {Node} node object
     */
    parseNode(nodeBlock) {
        const nodeChildren = nodeBlock.children;

        const nodeChildrenNames = [];
        for (var j = 0; j < nodeChildren.length; j++) {
            nodeChildrenNames.push(nodeChildren[j].nodeName);
        }
        var transformationsIndex = nodeChildrenNames.indexOf("transformations");
        var materialIndex = nodeChildrenNames.indexOf("material");
        var textureIndex = nodeChildrenNames.indexOf("texture");
        var animationIndex = nodeChildrenNames.indexOf("animationref");
        var descendantsIndex = nodeChildrenNames.indexOf("descendants");

        const nodeId = this.getNodeID(nodeBlock, false);

        const node = new Node(nodeId, this.scene); // already checked if node id existed

        // Transformations
        if (transformationsIndex != -1) {
            const transformationsNode = nodeChildren[transformationsIndex];
            const transformations = transformationsNode.children;

            const tmat = this.parseTransformations(transformations, node);
            node.setTransformationMatrix(tmat);
        } else {
            this.onXMLMinorError(`Node${this.getIDErrorMessage(nodeBlock)} doesn't have a 'transformations' block.`);
        }

        // Material

        const materialNode = nodeChildren[materialIndex];
        var matID = this.reader.getString(materialNode, 'id');
        if (matID == null)
            this.onXMLMinorError("no id defined for material");
        if (matID == "null") {
            node.setMaterial("null");
        } else if (this.materials[matID] != undefined) {
            node.setMaterial(this.materials[matID]);
        } else {
            this.onXMLMinorError(`Referenced material with id '${matID}' isn't defined.`);
        }


        // Texture
        
        const textureNode = nodeChildren[textureIndex];

        var texID = this.reader.getString(textureNode, 'id');
        if (texID == null)
            this.onXMLMinorError("no id defined for texture");
        if (texID == "clear" || texID == "null") {
            node.setTexture(texID);
        } else {
            if (this.textures[texID] != undefined) {
                node.setTexture(this.textures[texID]);
            } else {
                this.onXMLMinorError(`referenced texture with id '${texID}' isn't defined.`);
            }
        }

        if (textureNode.children.length == 0) {
            this.onXMLMinorError(`No amplification defined for texture in node${this.getIDErrorMessage(nodeBlock)} (using default afs=1 & aft=1).`); //uncomment when xml ready
        } else {
            const amplificationNode = textureNode.children[0];
            if (amplificationNode.nodeName != "amplification") {
                this.onXMLMinorError(`Invalid node name inside texture of node${this.getIDErrorMessage(nodeBlock)}`);
            } else {
                const amplification = this.getFloatParameters(textureNode.children[0], ['afs', 'aft']);
                if (amplification === null) {
                    this.onXMLMinorError(`invalid amplification parameters inside texture of node${this.getIDErrorMessage(nodeBlock)}`);
                } else {
                    node.setScaleFactors({ afs: amplification.afs, aft: amplification.aft });
                }

            }
        }

        // Animation
        if (animationIndex != -1){
            const animationNode = nodeChildren[animationIndex];
            var animationID = this.reader.getString(animationNode, 'id');

            if (this.animations[animationID] != undefined) {
                node.setAnimation(this.animations[animationID].copy());   // copies the animation to the node
            } else {
                this.onXMLMinorError(`Referenced animation in node with id '${nodeId}' doesn't exist`);
            }
        }

        // Descendants
        const descendantsNode = nodeChildren[descendantsIndex];
        const descendantCount = this.parseDescendants(descendantsNode.children, node);

        if (descendantCount <= 0) {
            this.onXMLMinorError("node with id " + this.reader.getString(nodeBlock, 'id') + " has no descendants");
        }

        return node;
    }

    /**
     * Parses a given <node> block's descendants
     * @param {descendants block element} descendants 
     * @param {node block element} node 
     */
    parseDescendants(descendants, node) {
        let descendantCount = 0;

        for (let child of descendants) {
            if (child.nodeName === "noderef") {
                let noderefID = this.getNodeID(child);
                if (noderefID == null) continue;
                
                node.addDescendantId(noderefID);

            } else if (child.nodeName === "leaf") {
                const leafObj = this.parseLeafNode(child, node);
                if (leafObj == null) continue;
                
                if (leafObj instanceof MyBoard) {
                    if (this.board != null) {
                        this.onXMLMinorError("It is only possible to have 1 board.");
                        continue;
                    }
                    this.board = leafObj;
                }

                node.addDescendantObj(new LeafNode(this.scene, leafObj));

            } else {
                this.onXMLMinorError("unknown tag <" + child.nodeName + "> inside descendants of node with id " + node.id);
                continue;
            }
            descendantCount++;
        }
        return descendantCount;
    }

    /**
     * @method parseTransformation
     * Parses the <transformation> node.
     * @param {transformation node block} transformation 
     * @return Object with properties: type (transformation type) and params (transformation values).
     */
    parseTransformation(transformation) {

        // Scale tranformation
        if (transformation.nodeName === "scale") {
            const params = ['sx', 'sy', 'sz'];

            const res = this.getFloatParameters(transformation, params);

            if (isNotNull(res)) {
                return { type: "scale", params: res };
            }
        } 
        
        // Translation transformation
        else if (transformation.nodeName === "translation") {
            const params = ['x', 'y', 'z'];

            const res = this.getFloatParameters(transformation, params);

            if (isNotNull(res)) {
                return { type: "translation", params: res };
            }
        } 
        
        // Rotation transformation
        else if (transformation.nodeName === "rotation") {  
            const angle = this.getFloatParameters(transformation, ['angle']);
            const axis = this.getCharParameter(transformation, 'axis');

            if (isNull(axis) || this.axisCoords[axis] == undefined) {
                this.onXMLMinorError(`Rotation transformation of 'animations' has invalid axis.`);
            } else if (isNotNull(angle) && isNotNull(axis)) {
                return { type: "rotation" + axis.toUpperCase(), params: { angle: angle.angle, axis: axis } };
            }
        }
    }

    /**
     * Returns a transformation matrix from a block of transformation nodes (rotation, scale, translation).
     * @param {transformations block element} transformations 
     * @param {Node} parent the parent node
     * @return the transformation matrix if not empty; null otherwise
     */
    parseTransformations(transformations, parent=null) {
        let transfMx = mat4.create();
        let hadTransformation = false;
        for (let child of transformations) {
            // Scale transformation
            if (child.nodeName === "scale") {
                const params = ['sx', 'sy', 'sz'];

                const res = this.getFloatParameters(child, params, parent);

                if (isNotNull(res)) {
                    mat4.scale(transfMx, transfMx, [res.sx, res.sy, res.sz]);
                    hadTransformation = true;
                }
            } 
            // Translation transformation
            else if (child.nodeName === "translation") {
                const params = ['x', 'y', 'z'];
    
                const res = this.getFloatParameters(child, params, parent);

                if (isNotNull(res)) {
                    mat4.translate(transfMx, transfMx, [res.x, res.y, res.z]);
                    hadTransformation = true;
                }
            } 
            // Rotation transformation
            else if (child.nodeName === "rotation") {    
                const angle = this.getFloatParameters(child, ['angle'], parent);
                const axis = this.getCharParameter(child, 'axis');

                if (isNull(axis) || this.axisCoords[axis] == undefined) {
                    this.onXMLMinorError(`Rotation child of 'transformations' node of node with id ${parent.id} has invalid axis.`);
                } else if (isNotNull(angle) && isNotNull(axis)) {
                    mat4.rotate(transfMx, transfMx, angle.angle*DEGREE_TO_RAD, this.axisCoords[axis]);
                    hadTransformation = true;
                }
            } 
            // No valid transformation
            else {
                this.onXMLMinorError(`Child of 'transformations' node of node with id '${parent.id}' has got an invalid nodeName ('${child.nodeName}').`);
            }
        }
        return hadTransformation ? transfMx : null;
    }

    /**
     * Generates the primitive for the leaf node
     * @param node the leaf node
     * @param parent the parent node
     */
    parseLeafNode(node, parent) {
        const leafType = this.reader.getString(node, 'type');
        if (leafType == null) {
            this.onXMLMinorError(`No type defined for leaf inside 'descendants' of node with id '${parent.id}'.`);
            return null;
        }

        const generatePrimitive = leafObjGenerator[leafType];
        if (generatePrimitive === undefined) {
            this.onXMLMinorError(`The leaf type ${leafType} inside 'descedants' of node with id '${parent.id}' is not implemented`);
            return null;
        }

        return generatePrimitive(this, node, parent, this.spritesheets);
    }

    /**
     * @param node the node to get the parameter from
     * @param {string} parameter the parameter's name 
     */
    getCharParameter(node, parameter) {
        const value = this.reader.getString(node, parameter);
        if (isNull(value)) {
            this.onXMLMinorError('no ' + parameter + ' defined');
            return null;
        }
        return value[0];
    }

    /**
     * @param {node block element} node 
     * @return the string " with id x" where x is the id of the node when the node has id; "" otherwise
     */
    getIDErrorMessage(node) {
        let id;
        if ((id = this.getNodeID(node, false)) != null) {
            return ` with id '${id}'`;
        }
        return "";
    }

    /**
     * Gets a node id. By default shows an error.
     * @param node the node to get the id from
     * @return the id if it exists; null otherwise
     */
    getNodeID(node, giveError = true) {
        const value = this.reader.getString(node, 'id');
        if (isNull(value)) {
            if (giveError)
                this.onXMLMinorError(`Node with name '${node.nodeName}' doesn't have a valid ID.`);
            return null;
        }
        return value;
    }

    /**
     * Gets a int parameter from node
     * @param {block element} node the node to get the parameter from
     * @param {string} parameter the parameter's name
     */
    getIntegerParameter(node, parameter) {
        const value = this.reader.getInteger(node, parameter);
        if (!isNotNull(value)) {
            //this.onXMLMinorError('no ' + parameter + ' defined for ' + node.nodeName);
            return null;
        } else if (isNaN(value)) {
            //this.onXMLMinorError('parameter ' + parameter + ' of ' + node.nodeName + ' is not a valid float');
            return null;
        }
        return value;
    }

    /**
     * Gets int parameters with names specified by 'parameters' from the specified 'node'.
     * @param {block element} node the node to get the parameters from
     * @param {array} parameters array with parameter names
     * @param {Node} parent parent obj. if != null, the parent id is used in error message
     * @return returns null if at least one of the parameters is invalid; array with indexed values otherwise
     */
    getIntegerParameters(node, parameters, parent = null, min = null, max = null) {
        const res = [];
        for (const p of parameters) {
            res[p] = this.getIntegerParameter(node, p);
            if (isNull(res[p]) || isNaN(res[p])) {
                this.onXMLMinorError(`Node with name '${node.nodeName}'${this.getIDErrorMessage(node)}${parent != null ? ` child of node with id '${parent.id}'` : ""} doesn't have a valid '${p}' parameter.`);
                return null;
            } else if((isNotNull(min) && res[p] < min) || (isNotNull(max) && res[p] > max)) {
                this.onXMLMinorError(`Node with name '${node.nodeName}'${this.getIDErrorMessage(node)}${parent != null ? ` child of node with id '${parent.id}'` : ""} doesn't have a valid '${p}' parameter (exceeds limits).`);
                return null;
            }
        }
        return res;
    }

    /**
     * Gets a float parameter from node
     * @param {block element} node the node to get the parameter from
     * @param {string} parameter the parameter's name
     */
    getFloatParameter(node, parameter) {
        const value = this.reader.getFloat(node, parameter);
        if (!isNotNull(value)) {
            //this.onXMLMinorError('no ' + parameter + ' defined for ' + node.nodeName);
            return null;
        } else if (isNaN(value)) {
            //this.onXMLMinorError('parameter ' + parameter + ' of ' + node.nodeName + ' is not a valid float');
            return null;
        }
        return value;
    }

    /**
     * Gets float parameters with names specified by 'parameters' from the specified 'node'.
     * @param {block element} node the node to get the parameters from
     * @param {array} parameters array with parameter names
     * @param {Node} parent parent obj. if != null, the parent id is used in error message
     * @return returns null if at least one of the parameters is invalid; array with indexed values otherwise
     */
    getFloatParameters(node, parameters, parent = null, min = null, max = null) {
        const res = [];
        for (const p of parameters) {
            res[p] = this.getFloatParameter(node, p);
            if (isNull(res[p]) || isNaN(res[p])) {
                this.onXMLMinorError(`Node with name '${node.nodeName}'${this.getIDErrorMessage(node)}${parent != null ? ` child of node with id '${parent.id}'` : ""} doesn't have a valid '${p}' parameter.`);
                return null;
            } else if((isNotNull(min) && res[p] < min) || (isNotNull(max) && res[p] > max)) {
                this.onXMLMinorError(`Node with name '${node.nodeName}'${this.getIDErrorMessage(node)}${parent != null ? ` child of node with id '${parent.id}'` : ""} doesn't have a valid '${p}' parameter (exceeds limits).`);
                return null;
            }
        }
        return res;
    }

    /**
     * Gets a boolean value from node
     * @param {node block element} node 
     * @param {string} name 
     * @param {string} messageError 
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null &&!isNaN(boolVal) && (boolVal == true || boolVal == false))) {
          this.onXMLMinorError("Unable to parse value component " + messageError + "; assuming 'value = 1'.");
          return true;
        }
        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * @method displayScene
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.objRoot.display();
    }
}