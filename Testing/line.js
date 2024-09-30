import * as THREE from "three";

export function makeLine(startX, startY, endX, endY) {
  const start = new THREE.Vector3(startX, startY, 0);
  const end = new THREE.Vector3(endX, endY, 0);

  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: "blue" });

  const line = new THREE.Line(geometry, material);

  line.geometry.userData.coordinates = [start.clone(), end.clone()];
  line.userData.type = "line";
  line.userData.isClicked = false;

  return line;
}
