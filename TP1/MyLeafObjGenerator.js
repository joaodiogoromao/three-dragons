
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

const leafObjGenerator = {
    rectangle: getRectanglePrimitive
}
