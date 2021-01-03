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

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
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

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @param {List<MySpritesheet>} spritesheets tha list of available spritesheets, indexed by id
 * @return the primitive object if args are valid; null otherwise
 */
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

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getPlanePrimitive(sceneGraph, node, parent) {
    const nparts = sceneGraph.getIntegerParameters(node, ['npartsU', 'npartsV'], parent);

    if (isNotNull(nparts))
        return new MyPlane(sceneGraph.scene, nparts.npartsU, nparts.npartsV);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getPatchPrimitive(sceneGraph, node, parent) {
    const params = sceneGraph.getIntegerParameters(node, ['npartsU', 'npartsV', 'npointsU', 'npointsV'], parent);
    const children = node.children;
    const controlPoints = [];
    for (const controlPointNode of children) {
        if (controlPointNode.nodeName != "controlpoint") {
            sceneGraph.onXMLMinorError(`Invalid node name '${controlPointNode.nodeName}' inside descendant primitive 'patch' of node with id '${parent.id}'`);
            continue;
        }
        const cpParams = sceneGraph.getFloatParameters(controlPointNode, ['xx', 'yy', 'zz'], parent);
        if (isNotNull(cpParams)) controlPoints.push(cpParams);
    }
    if (controlPoints.length != params.npointsU*params.npointsV)
        sceneGraph.onXMLMinorError(`The number of control points inside descendant primitive 'patch' of node with id '${parent.id}' is ${controlPoints.length}, but it should be ${params.npointsU*params.npointsV} (npointsU*npointsV)`);
    else if (isNotNull(params))
        return new MyPatch(sceneGraph.scene, params.npartsU, params.npartsV, params.npointsU, params.npointsV, controlPoints);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getBarrelPrimitive(sceneGraph, node, parent) {
    const fParams = sceneGraph.getFloatParameters(node, ['base', 'middle', 'height'], parent);
    const iParams = sceneGraph.getIntegerParameters(node, ['slices', 'stacks'], parent);
    if (isNotNull(fParams) && isNotNull(iParams))
        return new MyDefBarrel(sceneGraph.scene, fParams.base, fParams.middle, fParams.height, iParams.slices, iParams.stacks);
    return null;
}


/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getBoardPrimitive(sceneGraph, node, parent) {
    const whiteTile = sceneGraph.reader.getString(node, 'whiteTile');
    if (isNull(whiteTile)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a whiteTile id.`);
        return;
    }
    const blackTile = sceneGraph.reader.getString(node, 'blackTile');
    if (isNull(blackTile)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a blackTile id.`);
        return;
    }
    const whiteDice = sceneGraph.reader.getString(node, 'whiteDice');
    if (isNull(whiteDice)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a whiteDice id.`);
        return;
    }
    const blackDice = sceneGraph.reader.getString(node, 'blackDice');
    if (isNull(blackDice)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a blackDice id.`);
        return;
    }
    const dragonAltarSteps = sceneGraph.reader.getString(node, 'dragonAltarSteps');
    if (isNull(dragonAltarSteps)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a dragonAltarSteps id.`);
        return;
    }
    const dragonAltarShard = sceneGraph.reader.getString(node, 'dragonAltarShard');
    if (isNull(dragonAltarShard)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a dragonAltarShard id.`);
        return;
    }
    const dragonAltarAppearAnim = sceneGraph.reader.getString(node, 'dragonAltarAppearAnim');
    if (isNull(dragonAltarAppearAnim)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a dragonAltarAppearAnim id.`);
        return;
    }
    const mountain = sceneGraph.reader.getString(node, 'mountain');
    if (isNull(mountain)) {
        sceneGraph.onXMLMinorError(`Leaf 'board', descendant of node with id '${parent.id}' hasn't got a mountain id.`);
        return;
    }
    console.log(mountain);
    
    const dimensions = sceneGraph.getIntegerParameters(node, ['width', 'height'], parent);
    return new MyBoard(sceneGraph.scene, whiteTile, blackTile, whiteDice, blackDice, dimensions.width, dimensions.height, dragonAltarSteps, dragonAltarShard, dragonAltarAppearAnim, mountain);
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getButtonPrimitive(sceneGraph, node, parent) {
    const action = sceneGraph.reader.getString(node, 'action');
    if (isNull(action)) {
        sceneGraph.onXMLMinorError(`Leaf 'button', descendant of node with id '${parent.id}' hasn't got an action.`);
        return;
    }
    const text = sceneGraph.reader.getString(node, 'text');
    if (isNull(text)) {
        sceneGraph.onXMLMinorError(`Leaf 'button', descendant of node with id '${parent.id}' hasn't got a text field.`);
        return;
    }

    const textureId = sceneGraph.reader.getString(node, 'texture');
    let texture;
    if (!isNull(text)) {
        texture = sceneGraph.textures[textureId];
        console.log("TEXTURES", sceneGraph.textures, textureId, texture);
    }

    const name = sceneGraph.reader.getString(node, 'name');

    const iParams = sceneGraph.getIntegerParameters(node, ['rowStart', 'rowEnd', 'colStart', 'colEnd'], parent);
    if (isNotNull(iParams))
        return new MyButton(sceneGraph.scene, action, { row: { start: iParams.rowStart, end: iParams.rowEnd }, col: { start: iParams.colStart, end: iParams.colEnd } }, text, false, name, texture);
    return null;
}

/**
 * @param {MySceneGraph} sceneGraph 
 * @param {block element} node 
 * @param {Node | object with 'id' parameter} parent 
 * @return the primitive object if args are valid; null otherwise
 */
function getMenuPrimitive(sceneGraph, node, parent) {
    const titleValue = sceneGraph.reader.getString(node, 'title');
    const title = titleValue ? titleValue : "";
    const nameValue = sceneGraph.reader.getString(node, 'name');
    const name = nameValue ? nameValue : "";

    const iParams = sceneGraph.getIntegerParameters(node, ['rows', 'cols'], parent);
    const fParams = sceneGraph.getFloatParameters(node, ['horizontalPadding', 'verticalPadding', 'gridGap', 'aspectRatio'], parent);


    const buttons = [];
    const children = node.children;
    for (const buttonNode of children) {
        if (buttonNode.nodeName != "button") {
            sceneGraph.onXMLMinorError(`Invalid node name '${buttonNode.nodeName}' inside descendant primitive 'menu' of node with id '${parent.id}'`);
            continue;
        }
        const button = getButtonPrimitive(sceneGraph, buttonNode, parent);
        if (button) buttons.push(button);
    }

    if (isNotNull(iParams) && isNotNull(fParams))
        return new MyMenu(sceneGraph.scene, buttons, name, title, { aspectRatio: fParams.aspectRatio, gridGap: fParams.gridGap, rows: iParams.rows, cols: iParams.cols, horizontalPadding: fParams.horizontalPadding, verticalPadding: fParams.verticalPadding });
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
    spriteanim: getSpriteAnimationPrimitive,
    plane: getPlanePrimitive,
    defbarrel: getBarrelPrimitive,
    patch: getPatchPrimitive,
    board: getBoardPrimitive,
    button: getButtonPrimitive,
    menu: getMenuPrimitive
}
