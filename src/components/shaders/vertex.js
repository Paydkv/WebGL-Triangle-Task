const vertexShader = `
attribute vec4 vertexPosition;

void main() {
    gl_Position = vertexPosition;
}
`;

module.exports = vertexShader;

