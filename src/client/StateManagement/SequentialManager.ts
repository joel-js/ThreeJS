import * as THREE from "three";
import * as _ from "lodash";
import DoublyLinkedList from "../Utils/DoublyLinkedList";
import { Payload, track } from "../Utils/types";

let _track: track = track.active;
export const get_track = () => _track;
export const set_track = (i: track) => (_track = i);

let curr_index: number = -1;
export const get_curr_index = () => curr_index;
export const set_curr_index = (i: number) => (curr_index = i);

export class _State {
  public name: string;
  public payload: Payload;
  public type: string;
  constructor(name: string, type: string, payload: Payload) {
    this.name = name;
    this.type = type;
    this.payload = payload;
  }
}

export const sequence = new DoublyLinkedList<_State>();

const get_last = () => sequence.length - 1;

export const _get = (i: number): _State | undefined =>
  _.cloneDeep(sequence.get(i));

// export const _getter = (i: number): _State | undefined =>
// sequence.get(i);
/**
 * rt = [0, 0] => just add to the last
 * rt = [1, 0] => delete last and add to last
 * rt = [0, x] => just add after x
 * rt = [1, x] => delete x and insert at loc of x
*/
export const _set = (state: _State): [number, number] => {
  let rt: [number, number] = [0, 0];
  if(get_last() == -1){
    sequence.push(state);
    set_curr_index(get_curr_index() + 1);
    rt = [0, 0];
  }
  else {
    if (get_curr_index() === get_last()) {
      const curr_i = get_curr_index();
      const curr_state = sequence.get(curr_i);
      if (
        state.name === curr_state?.name &&
        state.payload.action === curr_state?.payload.action &&
        state.payload.action !== "add" &&
        state.payload.action !== "rotateOnAxis"
      ) {
        rt = [1, 0]; // [1, x]
        sequence.pop();
        sequence.push(state);
      }
      else {
        sequence.push(state);
        set_curr_index(get_curr_index() + 1);
        rt = [0, 0];
      }
    } else {
      const curr_i = get_curr_index();
      const curr_state = sequence.get(curr_i);
      
      if (
        state.name === curr_state?.name &&
        state.payload.action === curr_state?.payload.action &&
        state.payload.action !== "add" &&
        state.payload.action !== "rotateOnAxis"
        ) {
        rt = [1, curr_state.payload.payload_id]; // [1, x]
        sequence.delete(curr_i);
        sequence.insert(curr_i, state);
      }
      else {
        sequence.insert(curr_i + 1, state);
        if(curr_state)
          rt = [0, curr_state.payload.payload_id]; // [1, x]
        set_curr_index(get_curr_index() + 1);
      }
    }
  }
  console.log("**************");
  sequence.forEach((item) => console.log(item));
  console.log(sequence.length);
  console.log("**************");
  return rt;
};
