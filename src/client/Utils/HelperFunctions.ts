import * as THREE from "three";
import { Wrapper, WrapperLocalAxes, V3, MaterailProps, Mesh } from "./types";
import { VectorMap } from "./constants";
import SceneInit from "../SceneInit";
interface Element {
  value: any;
  prev: Element | null;
  next: Element | null;
}

export class DoublyLinkedList {
  private head: Element | null;
  private tail: Element | null;
  private elements: Element[];

  constructor(elements: any[]) {
    this.head = null;
    this.tail = null;
    this.elements = [];

    this.initialize(elements);
  }

  private initialize(elements: any[]): void {
    if (elements.length === 0) {
      return;
    }

    const firstElement: Element = {
      value: elements[0],
      prev: null,
      next: null,
    };
    this.head = firstElement;
    this.elements.push(firstElement);

    let prevElement: Element = firstElement;

    for (let i = 1; i < elements.length; i++) {
      const currentElement: Element = {
        value: elements[i],
        prev: prevElement,
        next: null,
      };

      prevElement.next = currentElement;
      this.elements.push(currentElement);
      prevElement = currentElement;
    }

    this.tail = prevElement;
  }

  public getPrevAndNext(element: any): { prev: any | null; next: any | null } {
    const targetElement = this.elements.find((el) => el.value === element);

    if (targetElement) {
      const prev = targetElement.prev ? targetElement.prev.value : null;
      const next = targetElement.next ? targetElement.next.value : null;
      return { prev, next };
    }

    return { prev: null, next: null };
  }
}

export const findTranslateAxis = (
  wrappers: Wrapper[],
  wrapper: Wrapper
): WrapperLocalAxes => {
  const name: string = wrapper.name;
  const list = new DoublyLinkedList(VectorMap);
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
      // console.log("prev => ", wrapper.position, this.wrappers[i].position);
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

export const prevNext = (wrappers: Wrapper[], wrapper: Wrapper) => {
  const name: string = wrapper.name;
  const list = new DoublyLinkedList(VectorMap);
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

export const getLocalY = (wrapper: Wrapper): V3 => {
  const worldY = new THREE.Vector3(0, 1, 0);
  const localY = worldY.applyQuaternion(wrapper.quaternion);
  console.log("localY ", localY);
  return localY;
};
export const clockWise = (wrapper: Wrapper, axes: WrapperLocalAxes) => {
  const angle = Math.PI / 18;
  const axis = axes.next.normalize();
  wrapper.rotateOnAxis(axis, angle);
};
export const antiClockWise = (wrapper: Wrapper, axes: WrapperLocalAxes) => {
  const angle = -(Math.PI / 18);
  const axis = axes.prev.normalize();
  wrapper.rotateOnAxis(axis, angle);
};
export const xclockWise = (wrapper: Wrapper, axis: V3) => {
  const angle = Math.PI / 18;
  const normAxis = axis.normalize();
  console.log("xclockWise: axis angle", normAxis, angle);
  wrapper.rotateOnAxis(normAxis, angle);
};
export const xantiClockWise = (wrapper: Wrapper, axis: V3) => {
  const angle = -Math.PI / 18;
  const normAxis = axis.normalize();
  console.log("xantiClockWise: axis angle", normAxis, angle);
  wrapper.rotateOnAxis(normAxis, angle);
};

export const negativeVector = (v: V3): V3 =>
  new THREE.Vector3(-v.x, -v.y, -v.z);

// export const newMaterials = (meshes: Mesh[], props: MaterailProps) => {
//   return meshes.map((mesh) => {
//     props.map(prop => )
//   })
// };
