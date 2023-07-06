import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/plyFilePath";
import TransformControl from "./Controls/TransformControl";
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";


const client = new SceneInit();
client.initialize();

client.scene.add(new THREE.AxesHelper(25));

const mainWrapper = new THREE.Group();

const sceneMeshes: THREE.Mesh[] = [];

const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const gumMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });


const orbitControls = new OrbitControls(
  client.camera,
  client.renderer.domElement
);
const transformControls = TransformControl(client, [orbitControls]);

const meshes: THREE.Mesh[] = [];
const meshWrappers: THREE.Group[] = [];

const main = (result: rt) => {
  result.wrappers.forEach((wrapper) => mainWrapper.add(wrapper));
};

plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
  .then((result) => {
    main(result)
  })
  .catch((error) => {
    console.error('Error loading PLY models:', error);
  });
client.scene.add(mainWrapper);

const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  orbitControls.update();
  client.render();
  stats.update();
};
animate();
