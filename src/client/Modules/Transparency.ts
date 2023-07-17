import * as THREE from "three";
import SceneInit from "../SceneInit";
import { Mesh } from "../Utils/types";

const iterate = (meshes: Mesh[], val: number) => {
  meshes.forEach((mesh) => {
    const material = new THREE.MeshPhongMaterial({
      color: mesh.name === "_gum.ply" ? 0xff8080 : 0xffffff,
      transparent: true,
      opacity: 1 - val,
    });
    mesh.material = material;
  });
};
const Transparency = (main: SceneInit) => {
  const gui = main.gui;
  const params = {
    transparency: 0,
  };
  const controller = gui
    .add(params, "transparency", 0, 1, 0.05)
    .name('transparency')
    .onChange((val) => {
      iterate(main.meshes, val);
    });
  controller.onFinishChange((val) => {
    iterate(main.meshes, val);
  });
};

export default Transparency;
