import * as THREE from "three";
import { WrapperType, WrapperLocalAxes, V3, Node } from "./types";
import { VectorMapFiles } from "./constants";
import SceneInit from "../SceneInit";
import VectorMap from "./VectorMap";

export const findTranslateAxis = (
  wrappers: WrapperType[],
  wrapper: WrapperType
): WrapperLocalAxes => {
  const name: string = wrapper.name;
  const list = new VectorMap(VectorMapFiles);
  const { prev, next } = list.getPrevAndNext(name);
  const vector: WrapperLocalAxes = {
    prev: new THREE.Vector3(),
    next: new THREE.Vector3(),
  };
  for (let i = 0; i < wrappers.length; i++) {
    if (prev && wrappers[i].name === prev) {
      vector.prev = new THREE.Vector3().subVectors(
        wrappers[i].position,
        wrapper.position
      );
    }
    if (next && wrappers[i].name === next) {
      vector.next = new THREE.Vector3().subVectors(
        wrappers[i].position,
        wrapper.position
      );
    }
  }
  return vector;
};

export const prevNext = (wrappers: WrapperType[], wrapper: WrapperType) => {
  const name: string = wrapper.name;
  const list = new VectorMap(VectorMapFiles);
  const { prev, next } = list.getPrevAndNext(name);
  let preVector: V3 = new THREE.Vector3();
  let nextVector: V3 = new THREE.Vector3();
  for (let i = 0; i < wrappers.length; i++) {
    if (prev && wrappers[i].name === prev) {
      preVector = wrappers[i].position;
    }
    if (next && wrappers[i].name === next) {
      nextVector = wrappers[i].position;
    }
  }
  if (!preVector.length()) preVector = wrapper.position;
  if (!nextVector.length()) nextVector = wrapper.position;
  return new THREE.Vector3().subVectors(preVector, nextVector);
};

export const getLocalY = (wrapper: WrapperType): V3 => {
  const worldY = new THREE.Vector3(0, 1, 0);
  const localY = worldY.applyQuaternion(wrapper.children[0].quaternion);
  return localY;
};
export const clockWise = (wrapper: WrapperType, axes: WrapperLocalAxes) => {
  const angle = Math.PI / 18;
  const axis = axes.next.normalize();
  wrapper.rotateOnAxis(axis, angle);
};
export const antiClockWise = (wrapper: WrapperType, axes: WrapperLocalAxes) => {
  const angle = -(Math.PI / 18);
  const axis = axes.prev.normalize();
  wrapper.rotateOnAxis(axis, angle);
};
export const xclockWise = (wrapper: WrapperType, axis: V3) => {
  const angle = Math.PI / 18;
  const normAxis = axis.normalize();
  wrapper.rotateOnAxis(normAxis, angle);
};
export const xantiClockWise = (wrapper: WrapperType, axis: V3) => {
  const angle = -Math.PI / 18;
  const normAxis = axis.normalize();
  wrapper.rotateOnAxis(normAxis, angle);
};

export const negativeVector = (v: V3): V3 =>
  new THREE.Vector3(-v.x, -v.y, -v.z);
export const addScalar = (v: V3, n: V3): V3 =>
  new THREE.Vector3(v.x + n.x, v.y + n.y, v.z + n.z);

export const ArchWire = (
  main: SceneInit,
  v1: V3 = new THREE.Vector3(),
  v2: V3 = new THREE.Vector3()
) => {
  const lineCurve = new THREE.LineCurve3(v1, v2);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    lineCurve.getPoints(10)
  );
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x00fff0 })
  );
  main.scene.add(line);
};

export const Arrow = (
  main: SceneInit,
  wrapper: WrapperType,
  dir: V3,
  originVector?: V3
) => {
  dir.normalize();
  const origin = originVector || wrapper.position;
  const length = 10;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
  main.scene.add(arrowHelper);
};
