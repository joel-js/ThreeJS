import * as THREE from 'three';
import { Wrapper, WrapperLocalAxes,V3, Node } from "./types";
import { VectorMap } from './constants';
import SceneInit from '../SceneInit';
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
  const localY = worldY.applyQuaternion(wrapper.children[0].quaternion);
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
  wrapper.rotateOnAxis(normAxis, angle);
};
export const xantiClockWise = (wrapper: Wrapper, axis: V3) => {
  const angle = -Math.PI / 18;
  const normAxis = axis.normalize();
  wrapper.rotateOnAxis(normAxis, angle);
};

export const negativeVector = (v: V3): V3 => new THREE.Vector3(-v.x, -v.y, -v.z); 
export const addScalar = (v: V3, n: V3): V3 => new THREE.Vector3(v.x+n.x, v.y+n.y, v.z+n.z);

export const ArchWire = (main: SceneInit, v1: V3 = new THREE.Vector3(), v2: V3 = new THREE.Vector3()) => {
  const lineCurve = new THREE.LineCurve3(v1, v2);
  const geometry = new THREE.BufferGeometry().setFromPoints(lineCurve.getPoints(10));
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00fff0 }));
  main.scene.add(line);
}

export const Arrow = (main: SceneInit, wrapper: Wrapper, dir: V3, originVector?:V3 ) => {

  dir.normalize();
  const origin = originVector || wrapper.position;
  const length = 10;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  main.scene.add( arrowHelper );
}


export class DoublyLinkedList2<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private len: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.len = 0;
  }

  public push(value: T): void {
    const newNode: Node<T> = {
      value: value,
      prev: this.tail,
      next: null,
    };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.len++;
  }

  public unshift(value: T): void {
    const newNode: Node<T> = {
      value: value,
      prev: null,
      next: this.head,
    };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.len++;
  }

  public pop(): T | undefined {
    if (!this.tail) {
      return undefined;
    }

    const lastValue = this.tail.value;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail!.next = null;
    }

    this.len--;

    return lastValue;
  }

  public shift(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const firstValue = this.head.value;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head!.prev = null;
    }

    this.len--;

    return firstValue;
  }

  public getHead(): T | undefined {
    return this.head ? this.head.value : undefined;
  }

  public getTail(): T | undefined {
    return this.tail ? this.tail.value : undefined;
  }

  public get(index: number): T | undefined {
    if (index < 0 || index >= this.len) {
      return undefined;
    }

    let currentNode = this.head;
    let currentIndex = 0;

    while (currentNode && currentIndex < index) {
      currentNode = currentNode.next;
      currentIndex++;
    }

    return currentNode ? currentNode.value : undefined;
  }

  get length(): number {
    return this.len;
  }

  public delete(index: number): boolean {
    if (index < 0 || index >= this.length) {
      return false; // Index out of bounds
    }

    // Find the node to be deleted
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode!.next;
    }

    // Update the references of previous and next nodes
    const prevNode = currentNode!.prev;
    const nextNode = currentNode!.next;
    if (prevNode) {
      prevNode.next = nextNode;
    } else {
      this.head = nextNode;
    }
    if (nextNode) {
      nextNode.prev = prevNode;
    } else {
      this.tail = prevNode;
    }

    this.len--;
    return true;
  }

  public forEach(callback: (value: T, index: number) => void): void {
    let currentNode = this.head;
    let index = 0;
    while (currentNode) {
      callback(currentNode.value, index);
      currentNode = currentNode.next;
      index++;
    }
  }
}