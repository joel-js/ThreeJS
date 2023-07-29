import { Node } from "./types";

export default class DoublyLinkedList<T> {
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
