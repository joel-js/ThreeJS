import { Object3D } from 'three';
import { V3 } from '../Utils/types';
import * as _ from 'lodash';
type Payload = {
  type: string,
  position?: V3,
  create?: Object3D
}

class State {

  public name: string;
  // public prev: string;
  public payload: Payload;

  constructor(name: string, payload : Payload) {
    this.name = name;
    // this.prev = prev;
    this.payload= payload;
  }
  
  get position () {
    if(this.payload) 
      return this.payload?.position
    else 
      return undefined
  }

};
const sequence: Array<State> = [];
let last: number = sequence.length-1;

export const _get = (): State | undefined => _.cloneDeep(sequence[last])

export const _set = (name: string, payload : Payload) => {
  if (sequence[last]?.name === name) {
    if (payload.type === sequence[last].payload.type){
      sequence[last].payload =  _.cloneDeep(payload);
    } else {
      last++;
      sequence.push(new State(name, payload));
    }
  }
  else {
    last++;
    sequence.push(new State(name, payload));
  }
  console.log(sequence);
}