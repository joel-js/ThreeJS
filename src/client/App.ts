import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';
import CustomController from "./Controls/CustomController/CustomController";

const App = (main: SceneInit, {meshes, wrappers}: rt) => {
  

const cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ wireframe: false, color: 0x00ff00}));
cube.position.set(0,10,0);
const cubeWrapper = new THREE.Group();
cubeWrapper.add(cube);
main.scene.add(cubeWrapper);
// const customController = new CustomController(main, {meshes: [cube], wrappers: [cubeWrapper]});
const customController = new CustomController(main, {meshes, wrappers});
customController.teethFunctions();
  // const cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ wireframe: false, color: 0x00ff00}));
  // cube.position.set(0,10,0);
  // const cubeWrapper = new THREE.Group();
  // cubeWrapper.add(cube);
  // client.scene.add(cubeWrapper);

  // const mouseEvents = new MouseEvents(main, { meshes, wrappers });
  // mouseEvents.highLight();
  // mouseEvents.selectWrapper();
}
 
export default App;