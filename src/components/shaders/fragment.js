const fragmentShader = `
precision mediump float;
uniform mat4 uColorMatrix;

void main() {
    gl_FragColor = uColorMatrix * vec4(1.0, 1.0, 1.0, 1.0);
}
`;

module.exports = fragmentShader;