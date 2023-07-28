import * as THREE from "three";
import * as _ from "lodash";
import SceneInit from "../SceneInit";
import { DoublyLinkedList2 } from "../Utils/HelperFunctions";
import { Payload, track, V3 } from "../Utils/types";
import { WrapperComponent } from "../Components/WrapperComponent";

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

// export const sequence: Array<_State> = [];
export const sequence= new DoublyLinkedList2<_State>();
let last: number = sequence.length - 1;
let sq_index = sequence.length - 1;
let curr_index: number = -1;

export const _get = (i: number): _State | undefined => _.cloneDeep(sequence.get(i));

export const _set = (state: _State): boolean => {
  let rt = false;
  if (last < 0) {
    console.log("<0", last);
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
  console.log("seq update ", sequence);
  return rt;
};

const reversePosition = (
  history: DoublyLinkedList2<Payload>,
  wrapper: WrapperComponent,
  curr_state: _State
) => {
  let oldAttribute: V3 = new THREE.Vector3(0,0,0);
      history.forEach((payload) => {
        if (payload.payload_id === curr_state.payload.payload_id) {
          return;
        }
        if (payload.action === curr_state.payload.action ) {
             oldAttribute = payload.position || oldAttribute;
        }
      });
      wrapper.position.copy(oldAttribute);
};

export const goBack = (main: SceneInit) => {
  _track = track.inactive;
  if (curr_index < 0) {
    curr_index = sequence.length - 1;
  }
  const curr_state = _get(curr_index);
  console.log("curr_state", curr_state);

  main.wrappers.forEach((wrapper) => {
    const history: DoublyLinkedList2<Payload> = wrapper.componentHistory().delta;
    if (curr_state?.payload.action === "position") {
      reversePosition(history, wrapper, curr_state);
    }
  });
  _track = track.active;
};
