import * as THREE from "three";
import * as _ from "lodash";
import { V3, Coord, MeshType } from "../Utils/types";
import { ComponentState } from "../StateManagement/ComponentState";
import { get_track } from "../StateManagement/SequentialManager";

export default class Wrapper extends THREE.Group {
  private wposition: V3;
  private wscale: V3;
  private wrotation: THREE.Euler;
  private mesh: MeshType;
  public name: string;
  private state: ComponentState;
  private wrotateAxis: V3;
  private wrotateAngle: number;

  constructor(name: string) {
    super();
    this.name = name;
    this.wposition = new THREE.Vector3();
    this.wscale = new THREE.Vector3();
    this.wrotation = new THREE.Euler();
    this.state = new ComponentState(this.name, this.type, _.cloneDeep(this), get_track() );
    this.mesh = new THREE.Mesh();
    this.wrotateAxis = new THREE.Vector3();
    this.wrotateAngle = 0;
  }

  get _position(): V3 {
    return this.position;
  }

  set _position(coord: Coord | V3) {
    if ("x" in coord && "y" in coord && "z" in coord) {
      this.position.set(coord.x, coord.y, coord.z);
    } else {
      this.position.copy(coord);
    }
    get_track() && this.state.set({ payload_id: Math.random(), action: "position", position: _.cloneDeep(this.position) })
    this.position.copy(this.position);
  }

  get _scale(): V3 {
    return this.scale;
  }

  set _scale(coord: Coord | V3) {
    if ("x" in coord && "y" in coord && "z" in coord) {
      this.wscale.set(coord.x, coord.y, coord.z);
    } else {
      this.wscale.copy(coord);
    }
    get_track() && this.state.set({ payload_id: Math.random(), action: "scale", scale: _.cloneDeep(this.wscale) })
    this.scale.copy(this.wscale);
  }

  get _rotation (): THREE.Euler {
    return this.rotation
  }

  set _rotation (angle: Coord | THREE.Euler) {
    if ("x" in angle && "y" in angle && "z" in angle) {
      this.wrotation.set(angle.x, angle.y, angle.z);
    } else {
      this.wrotation.copy(angle);
    }
    get_track() && this.state.set({ payload_id: Math.random(), action: "rotation", rotation: _.cloneDeep(this.wrotation) })
    this.rotation.copy(this.rotation);
  }

  public _add(mesh: THREE.Mesh){
    get_track() && this.state.set({payload_id: Math.random(), action: "add", add: _.cloneDeep(mesh)});
    this.add(mesh);
  }

  public _rotateOnAxis(axis: V3, angle: number) {
    const state = _.cloneDeep({axis, angle})
    this.wrotateAxis = axis;
    this.wrotateAngle = angle;
    get_track() && this.state.set({ payload_id: Math.random(), action: "rotateOnAxis", rotateOnAxis: state })
    this.rotateOnAxis(axis, angle);
  }

  public componentHistory(): ComponentState{
    return this.state;
  }
}
