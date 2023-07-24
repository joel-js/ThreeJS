import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import plyLoader from './Loaders/plyLoader';
import { Mesh, Wrapper } from './Utils/types';
const scene = new THREE.Scene()

const camera1 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
// const camera2 = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000)
// const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
// const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
const camera2 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
const camera3 = new THREE.PerspectiveCamera(90, 1, 0.1, 1000)
const camera4 = new THREE.PerspectiveCamera(90, 1, 0.1, 1000)

camera1.position.z = 50
camera2.position.y = 50
// camera2.lookAt(new THREE.Vector3(0, 0, 0))
camera3.position.z = -50
camera4.position.x = 50
camera4.position.z=-10
// camera4.lookAt(new THREE.Vector3(0, 0, 0))

const canvas1 = document.getElementById('c1') as HTMLCanvasElement
const canvas2 = document.getElementById('c2') as HTMLCanvasElement
const canvas3 = document.getElementById('c3') as HTMLCanvasElement
const canvas4 = document.getElementById('c4') as HTMLCanvasElement
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 })
renderer1.setSize(350, 350)
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 })
renderer2.setSize(350, 350)
const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 })
renderer3.setSize(350, 350)
const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 })
renderer4.setSize(350, 350)

//document.body.appendChild(renderer.domElement)

new OrbitControls(camera1, renderer1.domElement)
new OrbitControls(camera2, renderer2.domElement)
new OrbitControls(camera3, renderer3.domElement)
new OrbitControls(camera4, renderer4.domElement)

// const geometry = new THREE.TorusGeometry()
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     wireframe: true,
// })
const files: Array<string> = [
    "_gum.ply",
    "canine-left.ply",
    "canine-right.ply",
    "incisor-1-left.ply",
    "incisor-1-right.ply",
    "incisor-2-right.ply",
    "incisor-2-left.ply",
    "molar-1-left.ply",
    "molar-1-right.ply",
    "molar-2-left.ply",
    "molar-2-right.ply",
    "premolar-2-left.ply",
    "premolar-2-right.ply",
    "premolar-1-left.ply",
    "premolar-1-right.ply",
  ];
const meshes: Mesh[] = [];
const meshWrappers: Wrapper[] = [];
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const gumMaterial = new THREE.MeshBasicMaterial({ color: 0xff8080 });
const mainWrapper = new THREE.Group();
plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
 .then((result) => {
    // meshes = result.meshes;
    // wrappers = result.wrappers;
  result.wrappers.forEach((wrapper) => { 
   mainWrapper.add(wrapper)
  });
  console.log(mainWrapper);
  
 })
 .catch((error) => {
  console.error("Error loading PLY models:", error);
 });
 scene.add(mainWrapper);
// const loader = new PLYLoader();

//   // Replace 'your_ply_file.ply' with the actual path to your .ply file
//   loader.load('models/predicted.ply', function (geometry) {
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     console.log(geometry);
    
//     const mesh = new THREE.Mesh(geometry, material);
//     console.log(mesh);
    
//     scene.add(mesh);
//     animate()})

// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    render()
}

function render() {
    renderer1.render(scene, camera1)
    renderer2.render(scene, camera2)
    renderer3.render(scene, camera3)
    renderer4.render(scene, camera4)
}

animate()