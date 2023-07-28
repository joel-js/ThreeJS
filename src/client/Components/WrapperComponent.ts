import * as THREE from "three";
import * as _ from "lodash";
import { V3, Coord, Mesh } from "../Utils/types";
import { ComponentState } from "../StateManagement/ComponentState";
import { _track } from "../StateManagement/SequentialManager";

export class WrapperComponent extends THREE.Group {
  private wposition: V3;
  private mesh: Mesh;
  public name: string;
  private state: ComponentState;
  constructor(name: string) {
    super();
    this.name = name;
    this.wposition = new THREE.Vector3();
    this.state = new ComponentState(this.name, this.type, _.cloneDeep(this), _track );
    this.mesh = new THREE.Mesh();
  }

  get _position(): V3 {
    return this.position;
  }

  set _position(coord: Coord | V3) {
    if ("x" in coord && "y" in coord && "z" in coord) {
      this.wposition.set(coord.x, coord.y, coord.z);
    } else {
      this.wposition.copy(coord);
    }
    _track && this.state.set({ payload_id: Math.random(), action: "position", position: _.cloneDeep(this.wposition) })
    this.position.copy(this.wposition);
  }

  public _add(mesh: THREE.Mesh){
    _track && this.state.set({payload_id: Math.random(), action: "add", add: _.cloneDeep(mesh)});
    this.add(mesh);
  }
  public componentHistory(): ComponentState{
    return this.state;
  }
}
