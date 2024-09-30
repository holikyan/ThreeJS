import * as THREE from "three";

export function createLine(start, end) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: "blue" });
  const line = new THREE.Line(geometry, material);
  line.geometry.userData.cordinates = [start.clone(), end.clone()];
  line.userData.type = "line";
  line.userData.isClicked = false;

  return line;
}
