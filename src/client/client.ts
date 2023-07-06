import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import TransformControl from "./Controls/TransformControl";
import SceneInit from "./SceneInit";

const client = new SceneInit();
client.initialize();

client.scene.add(new THREE.AxesHelper(25));

const mainWrapper = new THREE.Group();

const sceneMeshes: THREE.Mesh[] = [];

const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

const orbitControls = new OrbitControls(client.camera, client.renderer.domElement);  
const transformControls = TransformControl(client, [ orbitControls ]);

const teeth = new THREE.Mesh();
const teethWrapper = new THREE.Group();
teeth.material = material;

plyLoader('models/incisor-2-left.ply', teeth, teethWrapper);
transformControls.attach(teethWrapper);
mainWrapper.add(teethWrapper);


const gum = new THREE.Mesh();
const gumWrapper = new THREE.Group();
gum.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });;

plyLoader('models/_gum.ply', gum, gumWrapper)
console.log(gum.name)
mainWrapper.add(gumWrapper);

client.scene.add(mainWrapper);

const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  orbitControls.update();
  client.render();
  stats.update();
};
animate();





