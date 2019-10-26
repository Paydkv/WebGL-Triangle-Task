const vertexShader = `
attribute vec3 vertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vertexPosition, 1.0);
}
`;

module.exports = vertexShader;

