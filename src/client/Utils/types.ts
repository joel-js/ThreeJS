export type WrapperType = THREE.Group;
export type MeshType = THREE.Mesh;
export type V3 = THREE.Vector3;
export type rt = {
  meshes: Array<MeshType>;
  wrappers: Array<WrapperType>;
};
export type Mouse = THREE.Vector2 & {
  x: number;
  y: number;
};

export type WrapperLocalAxes = {
  prev: V3;
  next: V3;
};

type propVal = {
  prop: string;
  val: any;
};

export type MaterailProps = Array<propVal>;

export type state = {
  material?: Object;
};
export type stateArray = {
  [key: string]: state;
};

export enum Mode {
  Translate = "translate",
  Rotate = "rotate",
  Scale = "scale",
}

export type Coord = {
  x: number;
  y: number;
  z: number;
};

export type Payload = {
  payload_id: number;
  action: string; // "position" | "rotation" | "scale" | "create" | "add"
  position?: V3;
  rotation?: THREE.Euler;
  scale?: V3;
  create?: THREE.Object3D;
  add?: THREE.Mesh;
};

export enum track {
  inactive,
  active,
}

export interface Node<T> {
  value: T;
  prev: Node<T> | null;
  next: Node<T> | null;
}

export enum Navigate {
  forward,
  backward
}