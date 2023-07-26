import { V3 } from '../Utils/types';

type Payload = undefined | {
  position: V3
}

class State {

  protected name: string;
  protected prev: string;
  protected payload: Payload;

  constructor(name: string, prev: string, payload ?: Payload) {
    this.name = name;
    this.prev = prev;
    this.payload= payload;
  }
  
  get position () {
    if(this.payload) 
      return this.payload?.position
    else 
      return undefined
  }

};
let last: string = '';
const sequence = new Map();

export const _get = (name: string): State | undefined => sequence.get(name)

export const _set = (name: string, payload ?: Payload) => {
  if (sequence.has(name)) {
    const prev = sequence.get(name).prev;
    sequence.set(name, new State(name, prev, payload || undefined));
  }
  else {
    sequence.set(name, new State(name,last, payload || undefined));
    last = name; 
  }
}