import * as THREE from "three";

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

  const t = (dir2.x * (start1.y - start2.y) - dir2.y * (start1.x - start2.x)) / det;
  const intersection = new THREE.Vector2(start1.x + t * dir1.x, start1.y + t * dir1.y);

  const perpendicularDir = new THREE.Vector2(-dir1.y, dir1.x).normalize();

  const dotProduct = perpendicularDir.dot(dir2);
  if (dotProduct < 0) {
    perpendicularDir.multiplyScalar(-1);
  }

  const originalLength = dir2.length();
  const newEnd = start2.clone().add(perpendicularDir.multiplyScalar(originalLength));

  posArray2[3] = newEnd.x;
  posArray2[4] = newEnd.y;

  first_vector.material.color = new THREE.Color(0, 0, 255, true);
  second_vector.material.color = new THREE.Color(0, 0, 255, true);

  second_vector.geometry.attributes.position.needsUpdate = true;

  return intersection;
}

import { getIntersectionCoordinates } from "./getIntersectionCordinates";

export function lineMakePerpendicular(line1, line2) {
  if (line1 && line2) {
    const intersection = getIntersectionCoordinates(line1, line2);

    const line1Start = new THREE.Vector3(line1.geometry.attributes.position.array[0], line1.geometry.attributes.position.array[1]);
    const line1End = new THREE.Vector3(line1.geometry.attributes.position.array[3], line1.geometry.attributes.position.array[4]);

    let line2Start = new THREE.Vector3(line2.geometry.attributes.position.array[0], line2.geometry.attributes.position.array[1]);
    const line2End = new THREE.Vector3(line2.geometry.attributes.position.array[3], line2.geometry.attributes.position.array[4]);

    const l1_O_start = intersection.distanceTo(line1Start);
    const l1_O_end = intersection.distanceTo(line1End);

    const l2_O_start = intersection.distanceTo(line2Start);
    const l2_O_end = intersection.distanceTo(line2End);

    const l1_distance = l1_O_start + l1_O_end;
    const l2_distance = l2_O_start + l2_O_end;

    const originalLength_L1 = line1Start.distanceTo(line1End);
    const originalLength_L2 = line2Start.distanceTo(line2End);

    if (l1_distance === originalLength_L1 && l2_distance === originalLength_L2) {
      console.log("crossing lines");

      const position = line1End.clone().sub(line1Start).normalize();
      const perpendicularPosition = new THREE.Vector3(position.y, -position.x);

      const start = line2Start.clone().add(perpendicularPosition);
      line2.geometry.attributes.position.array[1] = -start.x;
      line2.geometry.attributes.position.array[0] = -start.y;
      line2.geometry.attributes.position.needsUpdate = true;

      return;
    } else {
      const position = line1End.clone().sub(line1Start).normalize();
      const perpendicularPosition = new THREE.Vector3(position.y, -position.x);
      const intersectionToLine2Start = intersection.distanceTo(line2Start);
      const intersectionToLine2End = intersection.distanceTo(line2End);
      const perpendicularLineStartCoordinates = perpendicularPosition.clone().multiplyScalar(intersectionToLine2Start).add(intersection);
      const perpendicularLineEndCoordinates = perpendicularPosition.clone().multiplyScalar(intersectionToLine2End).add(intersection);

      line2.geometry.attributes.position.array[0] = perpendicularLineStartCoordinates.x;
      line2.geometry.attributes.position.array[1] = perpendicularLineStartCoordinates.y;
      line2.geometry.attributes.position.array[3] = perpendicularLineEndCoordinates.x;
      line2.geometry.attributes.position.array[4] = perpendicularLineEndCoordinates.y;

      line2.geometry.attributes.position.needsUpdate = true;
    }
  }
}
