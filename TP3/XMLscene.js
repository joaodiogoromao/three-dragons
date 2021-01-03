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

        this.sceneGraphs = []; 
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);
        this.setPickEnabled(true);

        this.sceneInited = false;

        this.initCameras();
        this.lockCamera();

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

        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

        this.spritesheetAppearance = new CGFappearance(this);

        this.tStarted = null;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.menuCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 140, 0.01), vec3.fromValues(0, 0, 0));
        this.gameCamera = new CGFcamera(Math.PI/4, 0.1, 500, vec3.fromValues(0, 20, 12), vec3.fromValues(0, 0, 0));
        
        this.camera = this.defaultCamera;
    }

    /**
     * Changes the current camera to the menu camera
     */
    setMenuCamera() {
        this.setCamera(this.menuCamera);
    }

    updateCameraLock() {
        console.log("Update camera lock", this.cameraLocked);
        if (this.cameraLocked) this.lockCamera();
        else this.unlockCamera();
    }

    /**
     * Makes it impossible for the user to drag the camera
     */
    lockCamera() {
        if (this.previousProcessMouseMove) throw new Error("Trying to lock camera, but previousProcessMouseMove is already set.");
        this.cameraLocked = true;

        if (this.previousCamera) {
            this.setCamera(this.previousCamera);
            this.previousCamera = null;
        }

        if (this.playerChangesSinceCameraUnlocked && this.playerChangesSinceCameraUnlocked % 2 == 1) {
            this.camera.orbit({X: (1, 0, 0), Y: (0, 1, 0), Z: (0, 0, 1)}, Math.PI);
            this.playerChangesSinceCameraUnlocked = null;
        }

        this.previousProcessMouseMove = this.interface.processMouseMove;
        this.interface.processMouseMove = () => {};
    }

    /**
     * Makes it possible for the user to drag the camera
     */
    unlockCamera() {
        if (!this.previousProcessMouseMove) throw new Error("Trying to unlock camera, but previousProcessMouseMove is not set.");
        this.cameraLocked = false;

        this.setCamera(this.camera);

        this.interface.processMouseMove = this.previousProcessMouseMove;
        this.previousProcessMouseMove = null;

        this.playerChangesSinceCameraUnlocked = 0;
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights(lights) {
        let i = 0;
        // Lights index.

        for (const key in lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (lights.hasOwnProperty(key)) {
                const graphLight = lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(false);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setLights(lights) {
        this.resetLights();
        this.initLights(lights);
        this.interface.createLightsInterface(sceneGraph.lights);
    }

    resetLights() {
        for (const light of this.lights) {
            light.disable();
            light.setVisible(false);
        }
    }

    resetSceneGraph() {
        this.sceneInited = false;
        this.setUpdatePeriod(0);

        this.resetLights();
        
        this.setCamera(this.gameCamera);

        this.cameras.splice(0, this.lights.length);
    }

    initSceneGraph(sceneGraphIndex) {
        let sceneGraph;
        if (sceneGraphIndex instanceof MySceneGraph) {
            sceneGraph = sceneGraphIndex;
        } else {
            sceneGraph = this.sceneGraphs[sceneGraphIndex];
        }

        sceneGraph.initCameras();

        this.gl.clearColor(...sceneGraph.background);

        this.setGlobalAmbientLight(...sceneGraph.ambient);

        this.initLights(sceneGraph.lights);

        this.interface.createLightsInterface(sceneGraph.lights);

        this.sceneInited = true;
        this.setUpdatePeriod(30);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded(type, data, filesLength) {
        console.log("ON GRAPH LOADED", type);
        if (type == MySceneGraph.types.SCENE) {

            //this.graph = data;

            this.sceneGraphs.push(data);

            //this.interface.createInterface();

        } else if (type == MySceneGraph.types.MENUS) {

            this.menus = data;
            if (this.menus.animations["inGameMenuAppear"]) {
                this.menus.appearAnimation = this.menus.animations["inGameMenuAppear"];
                this.menus.disappearAnimation = this.menus.appearAnimation.reverse();
            } else {
                throw new Error("No inGameMenuAppear animation in menus.");
            }

        } else if (type == MySceneGraph.types.GAME) {
            this.game = data;
            this.axis = new CGFaxis(this, this.game.referenceLength);
        }

        this.filesReceived = this.filesReceived ? this.filesReceived + 1 : 1;
        if (this.filesReceived == filesLength) {
            if (this.menus && this.game && this.sceneGraphs.length) {
                this.interface.createInterface();
                this.gameOrchestrator = new MyGameOrchestrator(this);
            } else {
                throw new Error("Received last graph but not all required types (game, menus and scene) received.");
            }
        }
    }

    addInterfaceField(object, property, name) {
        return this.interface.gui.add(object, property).name(name);
    }

    removeInterfaceField(field) {
        this.interface.gui.remove(field);
    }

    /**
     * Changes the active camera
     * @param {CGFcamera} camera 
     */
    setCamera(camera) {
        if (!this.cameraLocked) {
            this.previousCamera = camera;        
            this.camera = new CGFcamera(this.previousCamera.fov, this.previousCamera.near, this.previousCamera.far, this.previousCamera.position, this.previousCamera.target);
        } else {
            this.camera = camera;
        }
        this.interface.setActiveCamera(this.camera);
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
     * Sets the game camera
     */
    setGameCamera() {
        this.setCamera(this.gameCamera);
    }

    /**
     * Updates the scene's lights
     */
    updateLights(lights){
        var i = 0;
        for (let id in lights) {
            this.lights[i].setVisible(false);
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

    /**
     * Updates the scene
     * @param t timestamp in miliseconds
     */
    update(t) {
        if (this.tStarted == null) {
            this.tStarted = t;
            return;
        }
        const timeSinceProgramStarted = (t - this.tStarted)/1000;
        /*for (const i in this.graph.nodes) {
            this.graph.nodes[i].update(timeSinceProgramStarted);
        }*/

        this.gameOrchestrator.update(timeSinceProgramStarted);
    }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
						console.log("Picked object: ", obj, ", with pick id " + customId);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
    }
    
    discardPickResults() {
        if (this.pickResults != null && this.pickResults.length > 0) this.pickResults.splice(0, this.pickResults.length);
    }

    /**
     * Displays the scene.
     */
    display() {
        if (!this.sceneInited) return;
        // ---- BEGIN Background, camera and axis setup
        //this.logPicking();
        this.clearPickRegistration();

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

            this.gameOrchestrator.display();
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