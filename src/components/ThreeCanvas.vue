<template></template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref, defineExpose } from "vue";
import * as THREE from "three";
import { getCoordinates } from "../utils/getCoordinates.js";
import { objectDetection, objectSelection } from "../utils/getCoordinates.js";
import { createLine } from "../drawModels/line.js";
import { createCircle, updateCircle } from "../drawModels/circle.js";
import { hoverObjectColorChanger } from "../utils/getCoordinates.js";

const props = defineProps({
  objectType: String,
});

const emit = defineEmits(["clearCanvas"]);

let scene, camera, renderer, axesHelper;
let isDrawing = false;
let startCoordinate = null;
let currentDrawingObject = null;
const lines = ref(new Set());
const selectedLines = ref(new Set());
const hoveredLines = ref();
const originalColors = new Map();

function makeParallel(vectorToParallelize, referenceVector) {
  const unitReference = referenceVector.clone().normalize();
  return unitReference.multiplyScalar(vectorToParallelize);
}

function normalizVector(line, referenceVector) {
  const start = new THREE.Vector3(
    line.geometry.attributes.position.array[0],
    line.geometry.attributes.position.array[1],
    line.geometry.attributes.position.array[2]
  );
  const end = new THREE.Vector3(
    line.geometry.attributes.position.array[3],
    line.geometry.attributes.position.array[4],
    line.geometry.attributes.position.array[5]
  );

  const distance = end.distanceTo(start);
  const parallelVector = makeParallel(distance, referenceVector);

  line.geometry.attributes.position.array[3] = start.x + parallelVector.x;
  line.geometry.attributes.position.array[4] = start.y + parallelVector.y;
  line.geometry.attributes.position.array[5] = start.z + parallelVector.z;

  line.geometry.attributes.position.needsUpdate = true;
}

function parallelizeVectors() {
  const linesArray = Array.from(selectedLines.value);

  if (linesArray.length > 0) {
    const referenceVector = new THREE.Vector3().subVectors(
      new THREE.Vector3(
        linesArray[0].geometry.attributes.position.array[3],
        linesArray[0].geometry.attributes.position.array[4],
        linesArray[0].geometry.attributes.position.array[5]
      ),
      new THREE.Vector3(
        linesArray[0].geometry.attributes.position.array[0],
        linesArray[0].geometry.attributes.position.array[1],
        linesArray[0].geometry.attributes.position.array[2]
      )
    );

    for (let i = 1; i < linesArray.length; i++) {
      normalizVector(linesArray[i], referenceVector);
    }

    for (let line of selectedLines.value) {
      line.material.color = new THREE.Color(0, 0, 255, true);
    }

    selectedLines.value.clear();

    renderer.render(scene, camera);
  } else {
    console.warn("No lines selected to parallelize.");
  }
}

function initThreeJS() {
  axesHelper = new THREE.AxesHelper(1000);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 250;
  scene.add(axesHelper);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#wrapper").appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  renderer.setAnimationLoop(animate);
}

let selected = [];

function onMouseDown(event) {
  const coordinates = getCoordinates(event, camera);
  objectDetection(event, camera, scene, lines.value);

  if (props.objectType === "select") {
    objectSelection(event, camera, scene, selectedLines.value);
    // for (let line of Array.from(selectedLines.value)) {
    //   console.log(line);
    // }
  }

  if (props.objectType === "verticall") {
    let container = Array.from(selectedLines.value);
    container[0].material.color.set("orange");
    container[1].material.color.set("orange");
    console.log((container[0].geometry.attributes.position.array[0] += 50));
    container[0].geometry.attributes.position.needsUpdate = true;
  }

  if (!isDrawing) {
    startCoordinate = coordinates;
    isDrawing = true;

    if (props.objectType === "line") {
      currentDrawingObject = createLine(startCoordinate, startCoordinate);
      lines.value.add(currentDrawingObject);
      originalColors.set(
        currentDrawingObject,
        currentDrawingObject.material.color.clone()
      );
    } else if (props.objectType === "circle") {
      currentDrawingObject = createCircle(startCoordinate, 0);
    }

    if (currentDrawingObject) {
      scene.add(currentDrawingObject);
    }
  } else {
    if (currentDrawingObject) {
      if (props.objectType === "line") {
        currentDrawingObject.geometry.setFromPoints([
          startCoordinate,
          coordinates,
        ]);
      } else if (props.objectType === "circle") {
        const radius = startCoordinate.distanceTo(coordinates);
        updateCircle(currentDrawingObject, startCoordinate, radius);
      }
      currentDrawingObject.geometry.computeBoundingSphere();
    }
    isDrawing = false;
    startCoordinate = null;
    currentDrawingObject = null;
  }
}

function onMouseMove(event) {
  const moveCoordinates = getCoordinates(event, camera);

  if (props.objectType === "select") {
    hoverObjectColorChanger(event, camera, scene, "yellow", hoveredLines);
  }

  if (isDrawing && startCoordinate) {
    if (currentDrawingObject) {
      if (props.objectType === "line") {
        currentDrawingObject.geometry.setFromPoints([
          startCoordinate,
          moveCoordinates,
        ]);
      } else if (props.objectType === "circle") {
        const radius = startCoordinate.distanceTo(moveCoordinates);
        updateCircle(currentDrawingObject, startCoordinate, radius);
      }
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.render(scene, camera);
}

function clearCanvas() {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  lines.value.clear();
  selectedLines.value.clear();
  emit("clearCanvas");
}

function resetDrawingState() {
  if (isDrawing) {
    isDrawing = false;
    startCoordinate = null;
    currentDrawingObject = null;
  }
}

watch(
  () => props.objectType,
  (newType) => {
    if (newType === null) {
      clearCanvas();
    } else {
      resetDrawingState();
    }
  }
);

defineExpose({
  onMouseDown,
  clearCanvas,
  parallelizeVectors,
});

onMounted(() => {
  initThreeJS();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mousemove", onMouseMove);
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
#wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
