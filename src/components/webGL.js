const vertexSource = require('./shaders/vertex');
const fragmentSource = require('./shaders/fragment');

export const initGL = () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl'); // WebGL context Initialization
    if(gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    //Function to create a shader
    const createShader = (gl, shaderType, shaderSource) => {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            return null;
        }
        return program;
    };

    const program = createProgram(gl, vertexShader, fragmentShader);

    const vertexPosition = gl.getAttribLocation(program, "vertexPosition"); //Vertex shader attribute location
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //positionBuffer is now active buffer

    //Set a triangle and put this data into the active buffer
    let triangle = [
        0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangle),gl.STATIC_DRAW);

    //Draw the triangle

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas before drawing


    gl.useProgram(program);
    gl.enableVertexAttribArray(vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Specify details of how to pull the data out of positionBuffer
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next, 0 equals to numComponents
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.vertexAttribPointer(vertexPosition,numComponents,type,normalize,stride,offset);//bind vertexAttribute to the current ARRAY_BUFFER
    // Now we are able to change the ARRAY_BUFFER

    const count = 3;
    gl.drawArrays(gl.TRIANGLES, offset, count);
};


