export type Wrapper = THREE.Group;
export type Mesh = THREE.Mesh;
export type rt = {
  meshes: Array<Mesh>;
  wrappers: Array<Wrapper>;
};
export type Mouse = THREE.Vector2 & {
  x: number;
  y: number;
};
