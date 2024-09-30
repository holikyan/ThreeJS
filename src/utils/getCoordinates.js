import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));

export function getCoordinates(event, camera) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY - 50) / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  return raycaster.ray.intersectPlane(plane, new THREE.Vector3());
}

export function objectDetection(event, camera, scene, lines) {
  const intersections = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersections.length; i++) {
    if (intersections[i].object.userData.type === "line") {
      lines.add(intersections[i].object);
    }
  }
  if (intersections.length > 0) {
    return intersections[0].point;
  }
}

export function objectSelection(event, camera, scene, selectedLines, isVertical) {
  const intersections = raycaster.intersectObjects(scene.children);
  if (isVertical) {
    for (let i = 0; i < intersections.length; i++) {
      if (intersections[i].object.userData.type === "line") {
        intersections[i].object.userData.isClicked = true;
        selectedLines.add(intersections[i].object);
      }
    }
    return;
  }

  for (let i = 0; i < intersections.length; i++) {
    if (intersections[i].object.userData.type === "line") {
      intersections[i].object.material.color.set("red");
      intersections[i].object.userData.isClicked = true;
      selectedLines.add(intersections[i].object);
    }
  }
}

let hoveredLines = new Set();
const originalColors = new Map();
const baseColor = "blue";

export function hoverObjectColorChanger(event, camera, scene, hoverColor, hoveredLineContainer) {
  const intersections = raycaster.intersectObjects(scene.children);

  hoveredLines.forEach((line) => {
    if (!line.userData.isClicked) {
      line.material.color.set(baseColor);
    }
  });
  hoveredLines.clear();
  for (let i = 0; i < intersections.length; i++) {
    if (intersections[i].object.userData.type === "line") {
      const line = intersections[i].object;

      if (!originalColors.has(line)) {
        originalColors.set(line, line.material.color.clone());
      }

      if (!line.userData.isClicked) {
        line.material.color.set(hoverColor);
      }

      hoveredLines.add(line);
    }
  }
}
