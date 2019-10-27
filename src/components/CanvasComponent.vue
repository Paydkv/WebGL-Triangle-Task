<template>
    <div id="wrapper">
        <h1 id="header">WebGL Triangle Task</h1>
        <canvas id="glCanvas" width="400" height="400">
        </canvas>
        <div id="buttons">
            <button class="button" name="reverse" @click="reverseAnimation">Start rotation or change direction.</button>
            <button class="button" name="stop" @click="stopAnimation">Stop rotation</button>
            <button class="button" name="color" @click="colorSequenceChange">Randomly chosen color sequence</button>
        </div>
    </div>
</template>

<script>
    import {initGL, handleWebGL, stopRotation} from "@/components/webGL";

    export default {
        data() {
            return {
                Data: {},
                direction: -1, //If this parameter is set to -1, then rotation changes to the opposite, and vice versa
                ID: 0, //Key to apply clearInterval(key) in handleRotation function to reset the animation
                axes: [1, 0, 0], //Set the default color sequence to: red -> green -> white -> red
                colorSequences: [[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0]]
            }
        },
        name: 'CanvasComponent',
        methods: {
            startAnimation() {

            },
            reverseAnimation() {
                this.direction = this.direction * -1;
                this.ID = handleWebGL(this.Data, this.direction, this.ID, [...this.axes])
            },
            stopAnimation() {
                stopRotation(this.ID)
            },
            colorSequenceChange() {
                this.axes = this.colorSequences[Math.floor(Math.random() * 5)];
                this.ID = handleWebGL(this.Data, this.direction, this.ID, [...this.axes])
            }
        },
        mounted() {
            this.Data = initGL()
        }
    }
</script>

<style scoped>
    #wrapper {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 400px;
        height: 550px;
    }

    #header {
        margin: 0;
    }

    #buttons {
        display: flex;
        justify-content: space-around;
    }

    .button {
        border-radius: 5px;
        max-width: 150px;
        height: 40px;
    }
</style>