<template>
    <div id="wrapper">
        <h1 id="header">WebGL Triangle Task</h1>
        <canvas id="glCanvas" width="400" height="400">
        </canvas>
        <div id="buttons">
            <button class="button" name="reverse" @click="reverseAnimation">Start animation or change direction</button>
            <button class="button" name="color" @click="colorSequenceChange">Change color sequence</button>
        </div>
    </div>
</template>

<script>
    import {initGL, handleGL} from "@/components/webGL";

    export default {
        data() {
            return {
                Data: {},
                direction: -1, //If this parameter is set to -1, then rotation direction changes to the opposite, and vice versa.
                ID: 0, //Key to apply clearInterval(key) in handleGL function to reset the animation.
                axes: [1, 0, 0], /*Set the default color sequence to change around red (purple -> red -> yellow),
                axes array set color matrix rotation according to [r,g,b] respectively. */
                colorSequences: [[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0]], //Array of color sequences.
                sequenceIterator: 0
            }
        },
        name: 'CanvasComponent',
        methods: {
            reverseAnimation() {
                this.direction = this.direction * -1;
                this.ID = handleGL(this.Data, this.direction, this.ID, [...this.axes])
            },
            colorSequenceChange() {
                if (this.sequenceIterator === this.colorSequences.length) {
                    this.sequenceIterator = 0
                }
                this.sequenceIterator++;
                this.axes = this.colorSequences[this.sequenceIterator % 6]; //Choose next color sequence.
                this.ID = handleGL(this.Data, this.direction, this.ID, [...this.axes], true)
            }
        },
        mounted() {
            this.Data = initGL() //Initialize WebGL environment and import data: program, webgl context, etc.
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