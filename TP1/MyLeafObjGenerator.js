function getRectanglePrimitive(sceneGraph, node, parent) {
    console.log("Scale factors", parent.scaleFactors);

    const params = ['x1', 'y1', 'x2', 'y2'];

    const res = sceneGraph.getFloatParameters(node, params);

    if (isNotNull(res))
        return new MyRectangle(sceneGraph.scene, res.x1, res.y1, res.x2, res.y2, parent.scaleFactors[0], parent.scaleFactors[1]);
    return null;
}

function getTorusPrimitive(sceneGraph, node) {
    const params = ['inner', 'outer', 'slices', 'loops'];

    const res = sceneGraph.getFloatParameters(node, params);

    if (isNotNull(res))
        return new MyTorus(sceneGraph.scene, res.inner, res.outer, res.slices, res.loops);
    return null;
}

function getCylinderPrimitive(sceneGraph, node) {
    const params = ['height', 'topRadius', 'bottomRadius', 'stacks', 'slices'];

    const res = sceneGraph.getFloatParameters(node, params);
    
    if (isNotNull(res))
        return new MyCylinder(sceneGraph.scene, res.height, res.topRadius, res.bottomRadius, res.stacks, res.slices);
    return null;
}

function getTrianglePrimitive(sceneGraph, node, parent) {
    const params = ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'];

    const res = sceneGraph.getFloatParameters(node, params);

    const coords = [res.x1, res.y1, res.x2, res.y2, res.x3, res.y3];
    
    if (isNotNull(res))
        return new MyTriangle(sceneGraph.scene, coords, parent.scaleFactors[0], parent.scaleFactors[1]);
    return null;
}

function getSpherePrimitive(sceneGraph, node) {
    const params = ['radius', 'slices', 'stacks'];

    const res = sceneGraph.getFloatParameters(node, params);
    
    if (isNotNull(res))
        return new MySphere(sceneGraph.scene, res.radius, res.slices, res.stacks);
    return null;
}

function getPlaceHolderPrimitive(type) {
    console.warn("Placeholder of type " + type + " created.");
    return new PrimitivePlaceHolder();
}

const leafObjGenerator = {
    rectangle: getRectanglePrimitive,
    torus: getTorusPrimitive,
    cylinder: getCylinderPrimitive,
    triangle: getTrianglePrimitive,
    sphere: getSpherePrimitive
}
