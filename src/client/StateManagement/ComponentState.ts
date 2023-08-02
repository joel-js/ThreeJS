import * as _ from "lodash";

import { Object3D } from "three";
import { Payload, track } from "../Utils/types";
import { _set, _State, get_curr_index } from "./SequentialManager";
import DoublyLinkedList from "../Utils/DoublyLinkedList";

export class ComponentState {
  public name: string;
  public type: string;
  public obj: Object3D;
  public delta: DoublyLinkedList<Payload>;
  constructor(name: string, type: string, obj: Object3D, _track: track) {
    this.name = name;
    this.type = type;
    this.obj = obj;
    this.delta = new DoublyLinkedList<Payload>();
    this.initialize = this.initialize.bind(this);
    this.set = this.set.bind(this);
    _track && this.initialize(obj);
  }

  private addToSequence(): [number, number] {
    return _set(
      new _State(this.name, this.type, this.delta.getTail() as Payload)
    );
  }

  private initialize(obj: Object3D) {
    this.delta.push({
      payload_id: Math.random(),
      action: "create",
      create: obj,
    });
    this.addToSequence();
  }
  public set(payload: Payload) {
    this.delta.push(payload);
    const isUpdate: [number, number] = this.addToSequence();
    let last = this.delta.length - 1;
    if (isUpdate[0] === 1 && isUpdate[1] === 0) {
      console.log("here 10");
      this.delta.delete(last - 1);
    } else if (isUpdate[0] === 0 && isUpdate[1] !== 0) {
      console.log("here 0x");

      let insert_index = -1;
      this.delta.forEach((payload, i) => {
        if (payload.payload_id === isUpdate[1]) {
          insert_index = i;
        }
      });
      const la_val = this.delta.pop();
      this.delta.insert(insert_index + 1, la_val as Payload);
    } else if (isUpdate[0] === 1 && isUpdate[1] !== 0) {
      console.log("here 1x");
      let del_index = -1;
      this.delta.forEach((payload, i) => {
        if (payload.payload_id === isUpdate[1]) {
          del_index = i;
        }
      });
      this.delta.delete(del_index);
      const la_val = this.delta.pop();
      this.delta.insert(del_index, la_val as Payload);
    }
    for (let i = 0; i < this.delta.length; i++)
      console.log("delta ", this.delta.get(i));
  }
  public get() {
    return _.cloneDeep(this.delta.getTail());
  }
}
