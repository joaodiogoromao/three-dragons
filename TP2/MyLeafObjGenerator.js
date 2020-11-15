/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getRectanglePrimitive(sceneGraph, node, parent) {

    const params = ['x1', 'y1', 'x2', 'y2'];

    const res = sceneGraph.getFloatParameters(node, params, parent);

    if (isNotNull(res))
        return new MyRectangle(sceneGraph.scene, res.x1, res.y1, res.x2, res.y2);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getTorusPrimitive(sceneGraph, node, parent) {
    const floatParams = ['inner', 'outer'];
    const intParams = ['slices', 'loops'];

    const floatRes = sceneGraph.getFloatParameters(node, floatParams, parent);
    const intRes = sceneGraph.getIntegerParameters(node, intParams, parent);

    if (isNotNull(floatRes) && isNotNull(intRes))
        return new MyTorus(sceneGraph.scene, floatRes.inner, floatRes.outer, intRes.slices, intRes.loops);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getCylinderPrimitive(sceneGraph, node, parent) {
    const floatParams = ['height', 'topRadius', 'bottomRadius'];
    const intParams = ['stacks', 'slices'];

    const floatRes = sceneGraph.getFloatParameters(node, floatParams, parent);
    const intRes = sceneGraph.getIntegerParameters(node, intParams, parent);
    
    if (isNotNull(floatRes) && isNotNull(intRes))
        return new MyCylinder(sceneGraph.scene, floatRes.height, floatRes.topRadius, floatRes.bottomRadius, intRes.stacks, intRes.slices);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getTrianglePrimitive(sceneGraph, node, parent) {
    const params = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'];

    const res = sceneGraph.getFloatParameters(node, params, parent);
    
    if (isNotNull(res))
        return new MyTriangle(sceneGraph.scene, res);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getSpherePrimitive(sceneGraph, node, parent) {
    const floatParams = ['radius'];
    const intParams = ['slices', 'stacks'];

    const floatRes = sceneGraph.getFloatParameters(node, floatParams, parent);
    const intRes = sceneGraph.getIntegerParameters(node, intParams, parent);
    
    if (isNotNull(floatRes) && isNotNull(intRes))
        return new MySphere(sceneGraph.scene, floatRes.radius, intRes.slices, intRes.stacks);
    return null;
}


function getSpriteTextPrimitive(sceneGraph, node, parent) {
    const text = sceneGraph.reader.getString(node, 'text'); //TODO fazer getStringParameter (error checks)
    if (isNull(text)) {
        sceneGraph.onXMLMinorError(`Leaf spritetext, descendant of node with id '${parent.id}' hasn't got a text parameter.`);
        return;
    }

    if (isNotNull(text))
        return new MySpriteText(sceneGraph.scene, text);
    return null;
    
}

function getSpriteAnimationPrimitive(sceneGraph, node, parent, spritesheets) {
    const ssid = sceneGraph.reader.getString(node, 'ssid');
    if (isNull(ssid)) {
        sceneGraph.onXMLMinorError(`Leaf spriteanim, descendant of node with id '${parent.id}' hasn't got a spritesheet id.`);
        return;
    }
    
    if (spritesheets[ssid] === undefined || isNull(spritesheets[ssid])) {
        sceneGraph.onXMLMinorError(`Leaf spriteanim, descendant of node with id '${parent.id}' has a reference to undefined spritesheet with id '${ssid}'.`);
        return;
    }

    const duration = sceneGraph.getFloatParameters(node, ['duration'], parent);
    const startEnd = sceneGraph.getIntegerParameters(node, ['startCell', 'endCell'], parent);

    if (isNotNull(duration) && isNotNull(startEnd)) {
        return new MySpriteAnimation(sceneGraph.scene, spritesheets[ssid], duration.duration, startEnd.startCell, startEnd.endCell);
    }
    return null;
}


// Establishes correspondence between a leaf's type 
// and the function that creates its primitive
const leafObjGenerator = {
    rectangle: getRectanglePrimitive,
    torus: getTorusPrimitive,
    cylinder: getCylinderPrimitive,
    triangle: getTrianglePrimitive,
    sphere: getSpherePrimitive,
    spritetext: getSpriteTextPrimitive,
    spriteanim: getSpriteAnimationPrimitive
}
