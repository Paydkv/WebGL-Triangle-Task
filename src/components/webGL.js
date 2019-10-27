const vertexSource = require('./shaders/vertex');
const fragmentSource = require('./shaders/fragment');
import {mat4} from 'gl-matrix'

export const initGL = () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl'); // WebGL context Initialization.
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    //Function to create a shader.
    const createShader = (gl, shaderType, shaderSource) => {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    //Function to create a WebGL Program with shaders linked.
    const createProgram = (gl, vertexShader, fragmentShader) => {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            return null;
        }
        return program;
    };

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    //Get location for attributes and uniforms.
    const vertexPosition = gl.getAttribLocation(program, "vertexPosition");
    const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
    const colorMatrixLocation = gl.getUniformLocation(program, 'uColorMatrix');

    //Initialize buffer and make it active.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Set a triangle and push this data into the active buffer.
    const triangle = new Float32Array(
        [
            0, 0.5,
            -0.5, -0.5,
            0.5, -0.5
        ]
    );
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

    //WebGL Matrix creation using gl-matrix.
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    const colorMatrix = mat4.create();

    mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0); //Set camera position.
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -2]); //x,y,z view (move model on the screen to left-right or forward-back)
    mat4.scale(modelViewMatrix, modelViewMatrix, [1, 1, 1]); // scale x,y,z

    //-------- Draw the triangle

    // Clear the canvas before drawing.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Set position and matrices value.
    gl.enableVertexAttribArray(vertexPosition);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

    // Specify, how to pull the data out of positionBuffer.
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0); //bind vertexAttribute to the current ARRAY_BUFFER

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    //Collect and return data that we will need to create automatic rotation
    return {
        gl,
        program,
        triangle,
        Locations: {
            vertexPosition,
            projectionMatrixLocation,
            modelViewMatrixLocation,
            colorMatrixLocation
        },
        Matrices: {
            projectionMatrix,
            modelViewMatrix,
            colorMatrix
        }
    }
};

/*--------
Function that handles GL:   - Starts Y-axis rotation
                            - Changes its direction to opposite
                            - Sets a color sequence
--------*/

export const handleGL = (Data, direction = 1, ID = 0, axes, colorReset = false) => {
    const {gl, program, triangle, Locations, Matrices} = Data;
    gl.useProgram(program);
    clearInterval(ID); //Stop current animation.
    if (colorReset) mat4.identity(Matrices.colorMatrix); //Reset color if the proper button was clicked.
    const Rotate = () => {
        mat4.rotateY(Matrices.modelViewMatrix, Matrices.modelViewMatrix, direction * Math.PI / 180); //Initial counterclockwise rotation with "Math.PI / 180" speed.
        mat4.rotate(Matrices.colorMatrix, Matrices.colorMatrix, Math.PI / 100, [...axes]); //Initial color sequence according to received axes parameters.

        // Clear the canvas before drawing.
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

        gl.uniformMatrix4fv(Locations.modelViewMatrixLocation, false, Matrices.modelViewMatrix);
        gl.uniformMatrix4fv(Locations.colorMatrixLocation, false, Matrices.colorMatrix);

        gl.vertexAttribPointer(Locations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /*Start animation by calling Rotate() each 20 ms. Rotate() will turn the triangle and redraw it. Then return the setInterval's ID Key
    to be able to call clearInterval if there will be a new call of this function */

    return setInterval(() => {
        Rotate();
    }, 20);
};