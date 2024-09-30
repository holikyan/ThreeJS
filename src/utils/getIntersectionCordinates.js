import * as THREE from "three";
import { getSlope } from "./getSlope";
import { getY_Intercept } from "./getY_Intercept";

export function getIntersectionCoordinates(first_line, second_line) {
  const first_vector_coordinates = first_line.geometry.attributes.position.array;
  const second_vector_coordinates = second_line.geometry.attributes.position.array;

  const LINE1_DOTS_COORDINATES = {
    start_point_coordinates: {
      x: first_vector_coordinates[0],
      y: first_vector_coordinates[1],
    },
    end_point_coordinates: {
      x: first_vector_coordinates[3],
      y: first_vector_coordinates[4],
    },
  };

  const LINE2_DOTS_COORDINATES = {
    start_point_coordinates: {
      x: second_vector_coordinates[0],
      y: second_vector_coordinates[1],
    },
    end_point_coordinates: {
      x: second_vector_coordinates[3],
      y: second_vector_coordinates[4],
    },
  };

  const LINE1_DELTA_Y = LINE1_DOTS_COORDINATES.end_point_coordinates.y - LINE1_DOTS_COORDINATES.start_point_coordinates.y;
  const LINE1_DELTA_X = LINE1_DOTS_COORDINATES.end_point_coordinates.x - LINE1_DOTS_COORDINATES.start_point_coordinates.x;

  if (LINE1_DELTA_X === 0) {
    // return null;
    return "vertical";
  }

  const LINE1_SLOPE = getSlope(LINE1_DELTA_Y, LINE1_DELTA_X);
  const LINE1_Y_INTERCEPT = getY_Intercept(LINE1_DOTS_COORDINATES.start_point_coordinates.y, LINE1_SLOPE, LINE1_DOTS_COORDINATES.start_point_coordinates.x);

  const LINE2_DELTA_Y = LINE2_DOTS_COORDINATES.end_point_coordinates.y - LINE2_DOTS_COORDINATES.start_point_coordinates.y;
  const LINE2_DELTA_X = LINE2_DOTS_COORDINATES.end_point_coordinates.x - LINE2_DOTS_COORDINATES.start_point_coordinates.x;

  if (LINE2_DELTA_X === 0) {
    // return null;
    return "vertical";
  }

  const LINE2_SLOPE = LINE2_DELTA_Y / LINE2_DELTA_X;
  const LINE2_Y_INTERCEPT = LINE2_DOTS_COORDINATES.start_point_coordinates.y - LINE2_SLOPE * LINE2_DOTS_COORDINATES.start_point_coordinates.x;

  if (LINE1_SLOPE === LINE2_SLOPE) {
    return null;
  }

  const intersectionPoint_X = (LINE2_Y_INTERCEPT - LINE1_Y_INTERCEPT) / (LINE1_SLOPE - LINE2_SLOPE);
  const intersectionPoint_Y = LINE1_SLOPE * intersectionPoint_X + LINE1_Y_INTERCEPT;

  const intersectionVector = new THREE.Vector3(intersectionPoint_X, intersectionPoint_Y, 0);
  return intersectionVector;
}
