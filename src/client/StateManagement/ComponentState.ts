import * as _ from 'lodash';

import { Object3D } from "three";
import { Payload, track } from "../Utils/types";
import { _set, _State } from "./SequentialManager";
import DoublyLinkedList from '../Utils/DoublyLinkedList';

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

  private addToSequence(): boolean{
    return _set(new _State(this.name, this.type, this.delta.getTail() as Payload));
  }

  private initialize(obj: Object3D) {
    this.delta.push({ payload_id: Math.random() ,action: "create", create: obj });
    this.addToSequence();
  }
  public set(payload: Payload) {
    this.delta.push(payload)
    const isUpdate: boolean = this.addToSequence();
    let last = this.delta.length-1;
    if(isUpdate){
        this.delta.delete(last-1);
    }
    console.log('each delta ***********');
    for(let i=0; i<this.delta.length; i++)
      console.log('delta ',this.delta.get(i));
  }
  public get() {
    return _.cloneDeep(this.delta.getTail())
  }
}
