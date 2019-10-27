<template>
    <div id="app">
        <CanvasComponent/>
    </div>
</template>

<script>
    import CanvasComponent from "@/components/CanvasComponent";

    export default {
        name: 'app',
        components: {
            CanvasComponent,
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
