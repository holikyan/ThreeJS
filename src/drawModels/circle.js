import * as THREE from "three";

export function createCircle(center, radius) {
  const points = calculateCoords(center, radius);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "blue" });
  const line = new THREE.Line(geometry, material);
  return line;
}

export function updateCircle(circle, center, radius) {
  if (!circle || !circle.geometry) return;

  const points = calculateCoords(center, radius);
  circle.geometry.setFromPoints(points);
  circle.geometry.attributes.position.needsUpdate = true;
}

function calculateCoords(center, radius) {
  const points = [];
  const segments = 60;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, 0));
  }

  return points;
}
