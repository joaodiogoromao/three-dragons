
function getRectanglePrimitive(scene, reader, node) {
    const x1 = reader.getString(node, 'x1');
    if (x1 == null) {
        this.onXMLMinorError("no x1 defined for rectangle primitive");
        return null;
    }
    const y1 = reader.getString(node, 'y1');
    if (y1 == null) {
        this.onXMLMinorError("no y1 defined for rectangle primitive");
        return null;
    }
    const x2 = reader.getString(node, 'x2');
    if (x2 == null) {
        this.onXMLMinorError("no x2 defined for rectangle primitive");
        return null;
    }
    const y2 = reader.getString(node, 'y2');
    if (y2 == null) {
        this.onXMLMinorError("no y2 defined for rectangle primitive");
        return null;
    }
    return new MyRectangle(scene, x1, y1, x2, y2);
}

function getTorusPrimitive(scene, reader, node) {
    const inner = reader.getString(node, 'inner');
    if (inner == null) {
        this.onXMLMinorError("no inner defined for torus primitive");
        return null;
    }
    const outer = reader.getString(node, 'outer');
    if (outer == null) {
        this.onXMLMinorError("no outer defined for torus primitive");
        return null;
    }
    const slices = reader.getString(node, 'slices');
    if (slices == null) {
        this.onXMLMinorError("no slices defined for torus primitive");
        return null;
    }
    const loops = reader.getString(node, 'loops');
    if (loops == null) {
        this.onXMLMinorError("no loops defined for torus primitive");
        return null;
    }
    return new MyTorus(scene, inner, outer, slices, loops);
}

const leafObjGenerator = {
    rectangle: getRectanglePrimitive,
    torus: getTorusPrimitive
}
