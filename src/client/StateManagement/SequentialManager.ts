import * as THREE from "three";
import * as _ from "lodash";
import SceneInit from "../SceneInit";
import DoublyLinkedList from "../Utils/DoublyLinkedList";
import { Payload, track, V3, Navigate } from "../Utils/types";
import Wrapper from "../Components/Wrapper";

export let _track: track = track.active;

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
let last: number = sequence.length - 1;
let curr_index: number = -1;

export const _get = (i: number): _State | undefined =>
  _.cloneDeep(sequence.get(i));

export const _set = (state: _State): boolean => {
  let rt = false;
  if (last < 0) {
    sequence.push(state);
    last++;
  } else if (state.name === sequence.get(last)?.name) {
    if (state.payload.action === sequence.get(last)?.payload.action) {
      sequence.pop();
      sequence.push(state);
      rt = true;
    } else {
      sequence.push(state);
      last++;
    }
  }
  return rt;
};

const reverse_position_scale = (
  history: DoublyLinkedList<Payload>,
  wrapper: Wrapper,
  curr_state: _State,
  action: string
) => {
  let attribute: V3 =
    action === "position"
      ? new THREE.Vector3(0, 0, 0)
      : new THREE.Vector3(1, 1, 1);
  let flag = true;
  history.forEach((payload) => {
    if (payload.payload_id === curr_state.payload.payload_id) {
      flag = !flag;
      return;
    }
    if (flag && payload.action === curr_state.payload.action) {
      if (action === "position") attribute = payload.position || attribute;
      else attribute = payload.scale || attribute;
    }
  });
  if (action === "position") wrapper.position.copy(attribute);
  else wrapper.scale.copy(attribute);
};

export const navigateBack = (main: SceneInit) => {
  _track = track.inactive;
  if (curr_index < 0) {
    curr_index = sequence.length - 1;
  } else if (curr_index > sequence.length - 1) {
    curr_index = 0;
  }
  const curr_state = _get(curr_index);

  main.wrappers.forEach((wrapper) => {
    const history: DoublyLinkedList<Payload> = wrapper.componentHistory().delta;
    if (
      curr_state?.payload.action === "position" ||
      curr_state?.payload.action === "scale"
    ) {
      reverse_position_scale(
        history,
        wrapper,
        curr_state,
        curr_state?.payload.action
      );
    }
  });
  curr_index--;
  _track = track.active;
};

export const navigateForward = (main: SceneInit) => {
  _track = track.inactive;
  if (curr_index < 0) {
    curr_index = sequence.length - 1;
  } else if (curr_index > sequence.length - 1) {
    curr_index = 0;
  }
  curr_index++;
  console.log(curr_index);
  const curr_state = _get(curr_index);
  main.wrappers.forEach((wrapper) => {
    if(curr_state?.name === wrapper.name) {
      if(curr_state.payload.action === "position") {
        console.log(curr_state);
        wrapper.position.copy(curr_state.payload.position || new THREE.Vector3(0,0,0))
      }
      else {
        console.log(curr_state);
        wrapper.scale.copy(curr_state.payload.scale || new THREE.Vector3(1,1,1))
      }
    }
  })
  _track = track.active;
};