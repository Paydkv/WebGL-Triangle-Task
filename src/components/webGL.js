const vertexSource = require('./shaders/vertex');
const fragmentSource = require('./shaders/fragment');
import {mat4} from 'gl-matrix'

/*eslint-disable*/

export const initGL = () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl'); // WebGL context Initialization
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    //Function to create a shader
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

    //Function to create a WebGL Program with this two shaders linked. This way WebGL knows how to draw the data.
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


    const vertexPosition = gl.getAttribLocation(program, "vertexPosition"); //Vertex shader attribute location
    const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');

    let u_Color = gl.getUniformLocation(program, 'u_Color');
    gl.uniform4f(u_Color, 1.0, 1.0, 1.0, 1.0);


    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //positionBuffer is now active buffer

    //Set a triangle and put this data into the active buffer
    const triangle = new Float32Array(
        [
            0, 0.5,
            -0.5, -0.5,
            0.5, -0.5
        ]
    );
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

    //WebGL Matrix creation
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();

    // mat4.identity(modelViewMatrix);
    mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0); //camera position
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -2]); //view x,y,z (move model to left-right or forward-back)
    mat4.scale(modelViewMatrix, modelViewMatrix, [1, 1, 1]); // scale x,y,z

    //Draw the triangle

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas before drawing

    gl.enableVertexAttribArray(vertexPosition); //set position value
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix); //Set matrix value
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    // Specify details of how to pull the data out of positionBuffer
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);//bind vertexAttribute to the current ARRAY_BUFFER
    // Now we are able to change the ARRAY_BUFFER
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    //Push all required data in one object for easier management
    return {
        gl,
        program,
        triangle,
        Locations: {
            vertexPosition,
            projectionMatrixLocation,
            modelViewMatrixLocation
        },
        Colors: {
            u_Color
        },
        Matrices: {
            projectionMatrix,
            modelViewMatrix
        }
    }
};

export const handleRotation = (Data, turn = 1, key) => {
    const {gl, program, triangle, Locations, Colors, Matrices} = Data;
    gl.useProgram(program);
    clearInterval(key);
    const Rotate = () => {
        mat4.rotateY(Matrices.modelViewMatrix, Matrices.modelViewMatrix, turn * Math.PI / 180);
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);
        gl.uniformMatrix4fv(Locations.modelViewMatrixLocation, false, Matrices.modelViewMatrix);
        gl.vertexAttribPointer(Locations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush()
    };
    return setInterval(() => {   //Start animation and return the setInterval's ID Key
        Rotate()                        //to be able to call clearInterval if there will be a new call of this function
    }, 20);
};


