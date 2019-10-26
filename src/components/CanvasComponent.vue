<template>
    <div id="wrapper">
        <h1 id="header">WebGL Triangle Task</h1>
        <canvas id="glCanvas" width="400" height="400">
        </canvas>
        <div id="buttons">
            <button class="button" name="start" @click="startAnimation">Start Rotation</button>
            <div id="controlButtons">
                <button class="button" name="reverse" @click="startAnimation">Reverse Rotation</button>
                <button class="button" name="color" @click="startAnimation">Change Color</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {initGL, startRotation} from "@/components/webGL";

    export default {
        data() {
            return {
                Data: {}
            }
        },
        name: 'CanvasComponent',
        methods: {
            startAnimation() {
                startRotation(this.Data)
            },
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
    }

    .button {
        max-width: 80px;
        height: 40px;
    }

    #controlButtons {
        display: flex;
        justify-content: space-between;
        width: 170px;
        margin-left: auto;
    }
</style>