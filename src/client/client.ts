import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import Stats from "three/examples/jsm/libs/stats.module";

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));
const teethWrapper: THREE.Group = new THREE.Group();

const camera: THREE.PerspectiveCamera= new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
const transformControls: TransformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode("rotate");
scene.add(transformControls);

transformControls.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});

window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "g":
      transformControls.setMode("translate");
      break;
    case "r":
      transformControls.setMode("rotate");
      break;
    case "s":
      transformControls.setMode("scale");
      break;
  }
});

const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const material2: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const loader: PLYLoader = new PLYLoader();

const loadPLY = (
  fileName: string,
  material: THREE.MeshBasicMaterial,
  loader: PLYLoader,
  transformControl: boolean,
  callback?: (mesh: THREE.Mesh) => void
): void => {
  const geometry1 = (geometry: THREE.BufferGeometry): void => {
    const mesh = new THREE.Mesh(geometry, material);
    if (transformControl) {
      teethWrapper.add(mesh);
      const boundingBox = new THREE.Box3().setFromObject(mesh);
      const center = boundingBox.getCenter(new THREE.Vector3());
      teethWrapper.position.set(center.x, center.y, center.z);
      mesh.position.set(-center.x, -center.y, -center.z);
    }
    else scene.add(mesh);
    if(callback) callback(mesh); 
  };
  const progress1 = (xhr: ProgressEvent): void => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };
  const error1 = (error: ErrorEvent): void => {
    console.log(error);
  };
  loader.load(fileName, geometry1, progress1, error1);
};

transformControls.attach(teethWrapper);
scene.add(teethWrapper);

loadPLY("models/premolar-2-right.ply", material, loader, true, (mesh) => {
  // Access the position of the mesh here
  const meshPosition = mesh.position;
  console.log('meshPosition', mesh.position);
});
loadPLY("models/gum.ply", material2, loader, false);
window.addEventListener("resize", onWindowResize, false);
function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}


const stats = new Stats();
document.body.appendChild(stats.dom);


function animate(): void {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render(): void {
  renderer.render(scene, camera);
}

animate();
