import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/constants";
import { Mesh, Mode, Wrapper } from "./Utils/types";
import SceneInit from "./SceneInit";
import App from "./App";
import { initial_State } from "./StateManagement/StateManager";
import { WrapperComponent } from "./Components/WrapperComponent";

const client = new SceneInit();
client.initialize();
client.scene.add(new THREE.AxesHelper(25));
client.scene.background = new THREE.Color(0xc9c9d9);
const mainWrapper = new THREE.Group();

const material: Object = initial_State['teeth'].material || {};
const gumMaterial: Object = initial_State['gum'].material || {};
const meshes: Mesh[] = [];
const meshWrappers: Wrapper[] = [];

const wrapper = new WrapperComponent('wrapper');
const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial(gumMaterial));
wrapper.add(cube);
wrapper._position = {x: 5, y: 0, z: 0 };
// console.log(wrapper.position);
console.log('posclient ',wrapper._position);
mainWrapper.add(wrapper);
// plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
//   .then((result) => {
//     client.meshes = result.meshes;
//     client.wrappers = result.wrappers;
//     result.wrappers.forEach((wrapper) => { 
//       mainWrapper.add(wrapper)
//     });
//     App(client);
//   })
//   .catch((error) => {
//     console.error("Error loading PLY models:", error);
//   });
client.scene.add(mainWrapper);
const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  client.updateLightWithCamera();
  client.controller.update();
  client.render();
  stats.update();
};
animate();
