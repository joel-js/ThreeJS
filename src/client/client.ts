import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff)

const camera1 = new THREE.PerspectiveCamera(
  75,
  1,
  0.1,
  1000
);
const camera2 = new THREE.OrthographicCamera(-2,2,2,-2,0.1, 100);
camera1.position.z = 2;
camera2.position.z = 2;

const canvas1 = document.getElementById('1') as HTMLCanvasElement;  
const canvas2 = document.getElementById('2') as HTMLCanvasElement;  

const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
renderer1.setSize(200, 200);

const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
renderer2.setSize(200, 200);

const controls1 = new OrbitControls(camera1, canvas1);
const controls2 = new OrbitControls(camera2, canvas2);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// window.addEventListener("resize", onWindowResize, false);
// function onWindowResize() {
//   camera1.aspect = window.innerWidth / window.innerHeight;
//   camera1.updateProjectionMatrix();
//   renderer1.setSize(window.innerWidth, window.innerHeight);
//   render();
// }

function render() {
  renderer1.render(scene, camera1);
  renderer2.render(scene,camera2);
}

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  render();
  controls1.update();
  controls2.update();
}

animate();
