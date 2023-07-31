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

export const _set = (state: _State): boolean => {
  let rt = false;
  if (get_last() < 0) {
    sequence.push(state);
  } else if (
    get_curr_index() >= 0 &&
    get_curr_index() < get_last() &&
    state.name === sequence.get(get_curr_index())?.name
  ) {
    const curr_i = get_curr_index();
    if (
      state.payload.action === sequence.get(curr_i)?.payload.action &&
      state.payload.action !== "add"
    ) {
      sequence.delete(curr_i);
      sequence.insert(curr_i, state);
      rt = true;
    } else {
      sequence.insert(curr_i + 1, state);
    }
  } else if (state.name === sequence.get(get_last())?.name) {
    if (
      state.payload.action === sequence.get(get_last())?.payload.action &&
      state.payload.action !== "add"
    ) {
      sequence.pop();
      sequence.push(state);
      rt = true;
    } else {
      sequence.push(state);
    }
  }
  console.log("**************");
  sequence.forEach((item) => console.log(item));
  console.log("**************");
  return rt;
};
