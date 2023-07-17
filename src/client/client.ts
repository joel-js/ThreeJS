import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/constants";
import { Mesh, Wrapper } from "./Utils/types";
import SceneInit from "./SceneInit";
import App from "./App";

const client = new SceneInit();
client.initialize();
client.scene.add(new THREE.AxesHelper(25));
client.scene.background = new THREE.Color(0xc9c9d9);
const mainWrapper = new THREE.Group();

const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1
});
const gumMaterial = new THREE.MeshPhongMaterial({
  color: 0xff8080,
  transparent: true,
  opacity: 1
});
const meshes: Mesh[] = [];
const meshWrappers: Wrapper[] = [];

const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(100, 100, 0);
client.scene.add(ambientLight);
client.scene.add(directionalLight);
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material2 = [
//   new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Front face - red
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Back face - green
//   new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top face - blue
//   new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom face - yellow
//   new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Right face - magenta
//   new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Left face - cyan
// ];
// const mesh = new THREE.Mesh(geometry, material2);
// client.scene.add(mesh);
// const axis = new THREE.Vector3(0, 0, 1); // Y-axis
// const angle = Math.PI / 6;
// mesh.rotateOnAxis(axis, angle);
// // console.log('mesh', mesh)
// // // Get the local Y axis
// const worldY = new THREE.Vector3(0, 1, 0); // Assuming Y is the local up direction
// const localY = worldY.applyQuaternion(mesh.quaternion).normalize();
// // console.log(worldY);
// // const faceNormalsHelper = new THREE.FaceNormalsHelper(mesh, 1, 0x00ff00, 1);
// // const box = new THREE.Box3().setFromObject(mesh);
// // const center = box.getCenter(new THREE.Vector3());
// // const size = box.getSize(new THREE.Vector3());
// // const referenceVector = new THREE.Vector3(0, 1, 0); // Reference vector along the y-axis
// // const normal = new THREE.Vector3().crossVectors(size, referenceVector).normalize();
// // console.log(mesh);
// // console.log('Bounding Box Center:', center);
// // console.log('Bounding Box Size:', size);
// // console.log('Top Surface Normal:', normal);

// const perpendicular = new THREE.Vector3().crossVectors(localY, new THREE.Vector3(0,0,1));
// const perpendicular = new THREE.Vector3(0,0,0);
// console.log('perpendicular', perpendicular.length());

// const arrow = new THREE.ArrowHelper(perpendicular);
// arrow.setLength(10);
// arrow.setColor(0xff00ff);
// client.scene.add(arrow);

plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
  .then((result) => {
    client.meshes = result.meshes;
    client.wrappers = result.wrappers;
    result.wrappers.forEach((wrapper) => mainWrapper.add(wrapper));
    App(client);
  })
  .catch((error) => {
    console.error("Error loading PLY models:", error);
  });
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
