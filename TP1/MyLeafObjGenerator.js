function getRectanglePrimitive(sceneGraph, node) {
    const isNotNull = sceneGraph.isNotNull;

    const x1 = sceneGraph.getFloatParameter(node, 'x1');
    const y1 = sceneGraph.getFloatParameter(node, 'y1');
    const x2 = sceneGraph.getFloatParameter(node, 'x2');
    const y2 = sceneGraph.getFloatParameter(node, 'y2');

    if (isNotNull(x1) && isNotNull(y1) && isNotNull(x2) && isNotNull(y2))
        return new MyRectangle(sceneGraph.scene, x1, y1, x2, y2);
    return null;
}

function getTorusPrimitive(sceneGraph, node) {
    const isNotNull = sceneGraph.isNotNull;

    const inner = sceneGraph.getFloatParameter(node, 'inner');
    const outer = sceneGraph.getFloatParameter(node, 'outer');
    const slices = sceneGraph.getFloatParameter(node, 'slices');
    const loops = sceneGraph.getFloatParameter(node, 'loops');

    if (isNotNull(inner) && isNotNull(outer) && isNotNull(slices) && isNotNull(loops))
        return new MyTorus(sceneGraph.scene, inner, outer, slices, loops);
    return null;
}

function getCylinderPrimitive(sceneGraph, node) {
    const isNotNull = sceneGraph.isNotNull;

    const height = sceneGraph.getFloatParameter(node, 'height');
    const topRadius = sceneGraph.getFloatParameter(node, 'topRadius');
    const bottomRadius = sceneGraph.getFloatParameter(node, 'bottomRadius');
    const stacks = sceneGraph.getFloatParameter(node, 'stacks');
    const slices = sceneGraph.getFloatParameter(node, 'slices');
    
    if (isNotNull(height) && isNotNull(topRadius) && isNotNull(bottomRadius) && isNotNull(stacks) && isNotNull(slices))
        return new MyCylinder(sceneGraph.scene, height, topRadius, bottomRadius, stacks, slices);
    return null;
}

function getPlaceHolderPrimitive(type) {
    console.warn("Placeholder of type " + type + " created.")
    return new PrimitivePlaceHolder();
}

const leafObjGenerator = {
    rectangle: getRectanglePrimitive,
    torus: getTorusPrimitive,
    cylinder: getCylinderPrimitive,
    triangle: () => getPlaceHolderPrimitive("triangle"),
    sphere: () => getPlaceHolderPrimitive("sphere")
}
