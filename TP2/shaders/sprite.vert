attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float sizeM;
uniform float sizeN;
uniform float currentM;
uniform float currentN;

varying vec2 ST;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    float horizontalRatio = 1. / sizeM;
    float verticalRatio = 1. / sizeN;

    ST = vec2(aTextureCoord.s*horizontalRatio + horizontalRatio*currentM, aTextureCoord.t*verticalRatio + verticalRatio*currentN);
}
