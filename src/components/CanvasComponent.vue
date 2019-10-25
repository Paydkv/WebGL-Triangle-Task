<template>
    <div>
        <h1>WebGL Triangle Task</h1>
        <canvas id="glCanvas" width="600" height="600">
        </canvas>
    </div>
</template>

<script>
    import {initGL} from "@/components/webGL";
    export default {
        name: 'CanvasComponent',
        modules: {
        },
        mounted() {
            initGL()
        }
    }
</script>

<style scoped>

</style>