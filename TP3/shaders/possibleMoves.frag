#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	gl_FragColor.rgb = vec3(0.5, 0.1, 0.1);
    gl_FragColor.a = 1.0;
}