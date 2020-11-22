/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.materialStack = [];
        this.textureStack = [];

        this.selectedCamera = "";
        this.cameras = [];

        this.currentMaterial = null;
        this.currentTexture = null;

        this.displayAxis = false;

        this.defaultShader = super.activeShader;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.animations = [];

        this.defaultAppearance = new CGFappearance(this);
        this.defaultAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.spritesheetAppearance = new CGFappearance(this);

        this.tStarted = null;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.interface.createInterface();

        this.sceneInited = true;
        this.setUpdatePeriod(30);
    }

    /**
     * Changes the active camera
     * @param {CGFcamera} camera 
     */
    setCamera(camera) {
        this.camera = camera;
        this.interface.setActiveCamera(camera);
    }
    
    /**
     * Adds a camera to the cameras array
     * @param {string} cameraId 
     * @param {CGFcamera} camera 
     */
    addCamera(cameraId, camera) {
        this.cameras[cameraId] = camera;
    }

    /**
     * Sets the camera referenced by the selectedCamera variable
     */
    setSelectedCamera() {
        this.setCamera(this.cameras[this.selectedCamera]);
    }

    /**
     * Updates the scene's lights
     */
    updateLights(){
        var i = 0;
        for (let id in this.graph.lights) {
            if (this[id])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();
            i++;
        }
    }

    /**
     * Sets a given material
     * @param {CGFappearance} material 
     */
    setMaterial(material) {
        if (!(material instanceof CGFappearance) || material == null) return;
        this.currentMaterial = material;
        this.currentMaterial.setTexture(this.currentTexture);
        this.currentMaterial.apply();
    }

    /**
     * Saves the current material in the stack
     */
    pushMaterial() {
        this.materialStack.push(this.currentMaterial);
    }

    /**
     * Pops the previous material from the stack
     */
    popMaterial() {
        if (!this.materialStack.length) return;
        let mat = this.materialStack.splice(this.materialStack.length-1, this.materialStack.length);
        this.setMaterial(mat[0]);
    }

    /**
     * Sets a given texture
     * @param {CGFtexture} texture 
     */
    setTexture(texture) {
        if (this.currentMaterial == null) return;
        this.currentTexture = texture;
        this.currentMaterial.setTexture(texture);
        this.currentMaterial.apply();
    }

    /**
     * Saves the current texture in the stack
     */
    pushTexture() {
        this.textureStack.push(this.currentTexture);
    }

    /**
     * Pops the previous texture from the stack
     */
    popTexture() {
        if (!this.textureStack.length) return;
        let txt = this.textureStack.splice(this.textureStack.length-1, this.textureStack.length);
        this.setTexture(txt[0]);
    }

    update(t) {
        if (this.tStarted == null) {
            this.tStarted = t;
            return;
        }
        const timeSinceProgramStarted = (t - this.tStarted)/1000;
        for (const i in this.graph.nodes) {
            this.graph.nodes[i].update(timeSinceProgramStarted);
        }

    } 

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            if (this.displayAxis)
                this.axis.display();
 
            this.defaultAppearance.apply();
            this.currentMaterial = this.defaultAppearance;

            this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
        this.gl.disable(this.gl.BLEND);
    }
}