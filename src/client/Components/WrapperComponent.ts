import * as THREE from 'three';
import { V3, Coord } from '../Utils/types';
import { _get, _set } from '../StateManagement/SequentialManager';

export class WrapperComponent extends THREE.Group {
  
  private wposition: V3;
  public name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.wposition = new THREE.Vector3();
    _set(this.name);
  }

  get _position(): V3 {
    return this.position
  }

  set _position(coord: Coord | V3) {
    if( 'x' in coord && 'y' in coord && 'z' in coord){
      this.wposition.set(coord.x, coord.y, coord.z);
    } else {
      this.wposition.copy(coord);
    }
    _set(this.name, { position : this.wposition});
    const pos: V3 | undefined = _get(this.name)?.position;
    if (pos) this.position.copy(pos)
    else throw new Error('Position undefined');
  }

}