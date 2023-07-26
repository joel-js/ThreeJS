import * as THREE from 'three';
import { V3 } from '../Utils/types';

class Wrapper extends THREE.Group {
  
  private _position: V3;

  constructor() {
    super();
    this._position = new THREE.Vector3(); 
  }

  get wposition(): THREE.Vector3 {
    return this._position;
  }

  public setPosition(x: number, y: number, z: number): void {
    this._position.set(x,y,z);
    this.position.set(x,y,z);
  }

}