import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/constants";
import { Mesh, Mode, Wrapper } from "./Utils/types";
import SceneInit from "./SceneInit";
import App from "./App";
import { getState, initial_State } from "./StateManagement/StateManager";
import TransformControl from "./Controls/TransformControl";
// import { sqSave } from "./StateManagement/SequentialManager";
// import { Arrow, getLocalY } from "./Utils/HelperFunctions";
const printMat = (a: THREE.Matrix4) => {
  const array = a.toArray();
  for (let i = 0; i < 4; i++) {
    console.log(array.slice(i * 4, i * 4 + 4).join(' '));
  }
}
const client = new SceneInit();
client.initialize();
client.scene.add(new THREE.AxesHelper(25));
client.scene.background = new THREE.Color(0xc9c9d9);
const mainWrapper = new THREE.Group();

const material: Object = initial_State['teeth'].material || {};
const gumMaterial: Object = initial_State['gum'].material || {};
const meshes: Mesh[] = [];
const meshWrappers: Wrapper[] = [];
const cubegeometry = new THREE.BoxGeometry(1,1,1);
const cube = new THREE.Mesh(cubegeometry, new THREE.MeshLambertMaterial(gumMaterial));
cube.name = 'cube';
const cubeWrapper = new THREE.Group();
cubeWrapper.name = 'cubeWrapper';
cubeWrapper.add(cube);
mainWrapper.add(cubeWrapper);
meshes.push(cube);
meshWrappers.push(cubeWrapper);
// console.log(cubeWrapper.matrix, cubeWrapper.matrixWorld);
printMat(cube.matrix)
printMat(cube.matrixWorld)
// cubeWrapper.position.copy(new THREE.Vector3(0,5,0));
// console.log('cubeWrapper POS', cubeWrapper.position);
// console.log('cube POS',cube.position, cube);
// const cube2 = new THREE.Mesh(cubegeometry, new THREE.MeshLambertMaterial(gumMaterial));
// const cubeWrapper2 = new THREE.Group();
// cube2.name = 'cube2';
// cubeWrapper2.name = 'cubeWrapper2';
// cubeWrapper2.position.set(5, 0, 0);
// cubeWrapper2.add(cube2);
// mainWrapper.add(cubeWrapper2);
// meshes.push(cube2);
// meshWrappers.push(cubeWrapper2);

const callBack = (attachment: Mesh | Wrapper, mode: Mode) => {
  // sqSave(attachment, mode)
  // console.log(attachment)
console.log('**************************');
  printMat(attachment.children[0].matrix)
  console.log(" --------- ");
  printMat(attachment.children[0].matrixWorld)    
  console.log('----------- ')
};
const transformControl = TransformControl(client, cubeWrapper, callBack);
console.log(cubeWrapper);

// const transformControl2 = TransformControl(client, cubeWrapper2, callBack);
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
