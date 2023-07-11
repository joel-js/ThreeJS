export const files: Array<string> = [
  "_gum.ply",
  "canine-left.ply",
  "canine-right.ply",
  "incisor-1-left.ply",
  "incisor-1-right.ply",
  "incisor-2-right.ply",
  "incisor-2-left.ply",
  "molar-1-left.ply",
  "molar-1-right.ply",
  "molar-2-left.ply",
  "molar-2-right.ply",
  "premolar-2-left.ply",
  "premolar-2-right.ply",
  "premolar-1-left.ply",
  "premolar-1-right.ply",
];
export const VectorMap: Array<String> = [
  "molar-2-left.ply",
  "molar-1-left.ply",
  "premolar-2-left.ply",
  "premolar-1-left.ply",
  "incisor-2-left.ply",
  "incisor-1-left.ply",
  "canine-left.ply",
  "canine-right.ply",
  "incisor-1-right.ply",
  "incisor-2-right.ply",
  "premolar-1-right.ply",
  "premolar-2-right.ply",
  "molar-1-right.ply",
  "molar-2-right.ply"
];

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




