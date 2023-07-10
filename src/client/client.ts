import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/constants";
// import { rt } from './Utils/types';
import SceneInit from "./SceneInit";
import App from "./App";

const client = new SceneInit();
client.initialize();

client.scene.add(new THREE.AxesHelper(25));

const mainWrapper = new THREE.Group();

const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const gumMaterial = new THREE.MeshBasicMaterial({ color: 0xff8080 });
const meshes: THREE.Mesh[] = [];
const meshWrappers: THREE.Group[] = [];

plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
  .then((result) => {
    result.wrappers.forEach((wrapper) => mainWrapper.add(wrapper));
    App(client, result);
  })
  .catch((error) => {
    console.error('Error loading PLY models:', error);
  });
client.scene.add(mainWrapper);

const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  client.controller.update();
  client.render();
  stats.update();
};
animate();
