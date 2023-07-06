import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import TransformControl from "./Controls/TransformControl";
import SceneInit from "./SceneInit";

const client = new SceneInit();
client.initialize();

client.scene.add(new THREE.AxesHelper(25));

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

const orbitControls = new OrbitControls(client.camera, client.renderer.domElement);  
const transformControls = TransformControl(client, [ orbitControls ]);

const cube1: THREE.Mesh = new THREE.Mesh(geometry, material);
cube1.name = 'cube1Name';
const cubeWrapper = new THREE.Group();
cubeWrapper.name = 'cubeWrapperName'
cubeWrapper.add(cube1);

const sceneMeshes: THREE.Mesh[] = [];
sceneMeshes.push(cube1);

const mainWrapper = new THREE.Group();
mainWrapper.add(cubeWrapper);
client.scene.add(mainWrapper);

transformControls.attach(mainWrapper.children[0]);

sceneMeshes[0].material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
console.log('mainWrapper', mainWrapper.children[0].name);
console.log('cube', cube1.material);

const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  orbitControls.update();
  client.render();
  stats.update();
};
animate();





