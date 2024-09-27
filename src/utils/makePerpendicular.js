import * as THREE from "three";
import { getIntersectionCoordinates } from "./getIntersectionCordinates";
console.log(getIntersectionCoordinates);
export function verticalLine(first_vector, second_vector) {
  let isValidVector = first_vector === undefined && second_vector === undefined;
  if (isValidVector) {
    return null;
  }

  const posArray1 = first_vector.geometry.attributes.position.array;
  const posArray2 = second_vector.geometry.attributes.position.array;

  const start1 = new THREE.Vector2(posArray1[0], posArray1[1]);
  const end1 = new THREE.Vector2(posArray1[3], posArray1[4]);

  const start2 = new THREE.Vector2(posArray2[0], posArray2[1]);
  const end2 = new THREE.Vector2(posArray2[3], posArray2[4]);

  const dir1 = end1.clone().sub(start1);
  const dir2 = end2.clone().sub(start2);

  const det = -dir2.x * dir1.y + dir1.x * dir2.y;
  if (det === 0) {
    return null;
  }

  const t =
    (dir2.x * (start1.y - start2.y) - dir2.y * (start1.x - start2.x)) / det;
  const intersection = new THREE.Vector2(
    start1.x + t * dir1.x,
    start1.y + t * dir1.y
  );

  const perpendicularDir = new THREE.Vector2(-dir1.y, dir1.x).normalize();

  const dotProduct = perpendicularDir.dot(dir2);
  if (dotProduct < 0) {
    perpendicularDir.multiplyScalar(-1);
  }

  const originalLength = dir2.length();
  const newEnd = start2
    .clone()
    .add(perpendicularDir.multiplyScalar(originalLength));

  posArray2[3] = newEnd.x;
  posArray2[4] = newEnd.y;

  first_vector.material.color = new THREE.Color(0, 0, 255, true);
  second_vector.material.color = new THREE.Color(0, 0, 255, true);

  second_vector.geometry.attributes.position.needsUpdate = true;

  return intersection;
}
