<template>
  <header class="header">
    <button class="btn" @click="activateLine">Line</button>
    <button class="btn" @click="activateCircle">Circle</button>
    <button class="btn" @click="activateClear">Clear</button>
    <button class="btn" @click="activateParallel">Parallel</button>
    <button class="btn" @click="activateSelect">Select</button>
    <button class="btn" @click="acitvateVertically">vertically</button>
    <ThreeCanvas
      ref="threeCanvas"
      :objectType="currentObjectType"
      @clearCanvas="handleClearCanvas"
    />
  </header>
</template>

<script setup>
import { ref } from "vue";
import ThreeCanvas from "./ThreeCanvas.vue";

const currentObjectType = ref(null);
const threeCanvas = ref(null);

function activateLine() {
  currentObjectType.value = "line";
  threeCanvas.value?.onMouseDown(new MouseEvent("mousedown"));
}

function activateCircle() {
  currentObjectType.value = "circle";
  threeCanvas.value?.onMouseDown(new MouseEvent("mousedown"));
}

function activateClear() {
  currentObjectType.value = null;
  threeCanvas.value?.clearCanvas();
}

function activateParallel() {
  threeCanvas.value?.parallelizeVectors();
}

function activateSelect() {
  currentObjectType.value = "select";
  threeCanvas.value?.onMouseDown(new MouseEvent("click"));
}

function acitvateVertically() {
  currentObjectType.value = "verticall";
  threeCanvas.value?.onMouseDown(new MouseEvent("mousedown"));
}

function handleClearCanvas() {}
</script>

<style scoped>
.header {
  width: 100%;
  height: 50px;
  background-color: rgb(29, 168, 115);
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.btn {
  padding: 5px 8px;
  border: none;
  border-radius: 3px;
  margin: 0 3px;
  cursor: pointer;
}
</style>
