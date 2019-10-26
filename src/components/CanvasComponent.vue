<template>
    <div id="wrapper">
        <h1 id="header">WebGL Triangle Task</h1>
        <canvas id="glCanvas" width="400" height="400">
        </canvas>
        <div id="buttons">
            <button class="button" name="reverse" @click="reverseAnimation">Start rotation or change direction.</button>
            <button class="button" name="color" @click="reverseAnimation">Change Color</button>
        </div>
    </div>
</template>

<script>
    import {initGL, handleRotation} from "@/components/webGL";

    export default {
        data() {
            return {
                Data: {},
                turn: -1, //If turn is set to -1, then rotation changes to the opposite, and vice versa
                key: '' //Key to apply clearInterval(key) in handleRotation function to reset the animation
            }
        },
        name: 'CanvasComponent',
        methods: {
            reverseAnimation() {
                this.turn = this.turn * -1;
                this.key = handleRotation(this.Data, this.turn, this.key);
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