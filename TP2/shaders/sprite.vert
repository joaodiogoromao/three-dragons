attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform int sizeM;
uniform int sizeN;
uniform int currentM;
uniform int currentN;

varying vec2 ST;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    float horizontalRatio = 1. / sizeM;
    float verticalRatio = 1. / sizeN;


	ST = vec2(vec2(currentM*horizontalRatio, (currentM+1)*horiontalRatio), vec2(currentN*verticalRatio, (currentM+1)*verticalRatio));
}
