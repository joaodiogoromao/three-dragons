//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 
    'XMLscene.js', 
    'parser/MySceneGraph.js', 
    'MyInterface.js', 
    'primitives/MyRectangle.js', 
    'parser/MyGraphNode.js', 
    'parser/MyLeafObjGenerator.js', 
    'primitives/MyTorus.js', 
    'primitives/MyCylinder.js', 
    'primitives/MyTriangle.js', 
    'primitives/MySphere.js', 
    'primitives/MyBoard.js', 
    'primitives/MyPlane.js', 
    'primitives/MyPatch.js', 
    'primitives/MyDefBarrel.js', 
    'primitives/MyButton.js', 
    'primitives/MyMenu.js', 
    'primitives/sprites/MySpriteAnimation.js',
    'primitives/sprites/MySpriteText.js', 
    'animation/MyAnimation.js', 
    'animation/MyKeyframeAnimation.js',  
    'animation/MyCurveAnimation.js',
    'animation/MyCameraAnimation.js', 
    'sprites/MySpriteSheet.js',
    'control/MyConnection.js', 
    'control/MyGameOrchestrator.js', 
    'control/MyMenuController.js', 
    'control/state/MyState.js', 
    'control/state/MyStateOverMenu.js', 
    'control/state/MyStateMainMenu.js', 
    'control/state/MyStatePauseMenu.js', 
    'control/state/MyStatePlaying.js',
    'control/game/MyGame.js', 
    'control/game/state/MyGameState.js', 
    'control/game/state/MyStateMoving.js', 
    'control/game/state/MyStateWaiting.js', 
    'control/game/state/MyStatePiecePicked.js', 
    'control/game/state/MyStateMachine.js',
    'control/game/pickingstrategies/MyStrategy.js', 
    'control/game/pickingstrategies/MyHvMStrategy.js', 
    'control/game/pickingstrategies/MyMvMStrategy.js', 
    'control/game/pickingstrategies/MyHvHStrategy.js', 

main=function()
{
	// Standard application, scene and interface setup
    const app = new CGFapplication(document.body);
    const myInterface = new MyInterface();
    const myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    const filename=getUrlVars()['file'] || "three_dragons.xml";

	// create and load graph, and associate it to scene. 
    // Check console for loading errors
    const files = [
        { name: "menus.xml", type: MySceneGraph.types.MODULE },
        { name: "three_dragons.xml", type: MySceneGraph.types.SCENE }
    ];

    files.forEach((file) => new MySceneGraph(file.name, myScene, file.type));
	
	// start
    app.run();
}

]);