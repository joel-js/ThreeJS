import DoublyLinkedList from "./DoublyLinkedList";

export default class VectorMap extends DoublyLinkedList<string> {
  constructor(arr: string[]) {
    super();
    arr.forEach((str) => this.push(str));
  }

  public getPrevAndNext(value: string): {prev: string | null, next: string | null} {
    let surroundings: {prev: string | null, next: string | null} = {prev: null, next: null};
    let found = false;
    
    this.forEach((currentValue, index) => {
      if (currentValue === value) {
        surroundings.prev = this.get(index - 1) || null;
        surroundings.next = this.get(index + 1) || null;
        found = true;
      }
    });

    if (!found) {
      throw new Error(`Value ${value} does not exist in the list.`);
    }
    
    return surroundings;
  }
}
