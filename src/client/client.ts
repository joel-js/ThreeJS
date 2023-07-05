import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import TransformControl from "./Controls/TransformControl";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

// const raycaster: THREE.Raycaster = new THREE.Raycaster();
// const sceneMeshes: THREE.Mesh[] = [];
// const wrapperList: THREE.Group[] = [];
// let intersectedObject: THREE.Object3D | null;
// const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {};


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 4, 4);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

// const highlightedMaterial = new THREE.MeshBasicMaterial({
  //   wireframe: true,
  //   color: 0x00ff00,
  // });

const orbitControls = new OrbitControls(camera, renderer.domElement);
  
const transformControls = TransformControl(scene, camera, renderer, [ orbitControls ]);

const cube1: THREE.Mesh = new THREE.Mesh(geometry, material);
cube1.name = 'cube1Name';
const cubeWrapper = new THREE.Group();
cubeWrapper.name = 'cubeWrapperName'
cubeWrapper.add(cube1);

const sceneMeshes: THREE.Mesh[] = [];
sceneMeshes.push(cube1);

const mainWrapper = new THREE.Group();
mainWrapper.add(cubeWrapper);
scene.add(mainWrapper);

transformControls.attach(mainWrapper.children[0]);

sceneMeshes[0].material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
console.log('mainWrapper', mainWrapper.children[0].name);
console.log('cube', cube1.material);

// const wrapper1 = new THREE.Group();
// cube1.position.set(0, 0, 0);
// cube1.name = "cube1";
// sceneMeshes.push(cube1);
// wrapper1.name = "cubeWrapper1";
// wrapper1.add(cube1);
// wrapperList.push(wrapper1);
// scene.add(wrapper1);

// const cube2: THREE.Mesh = new THREE.Mesh(geometry, material);
// const wrapper2 = new THREE.Group();
// cube2.position.set(0, 4, 0);
// cube2.name = "cube2";
// sceneMeshes.push(cube2);
// wrapper2.name = "cubeWrapper2";
// wrapper2.add(cube2);
// wrapperList.push(wrapper2);
// scene.add(wrapper2);



    

// type Mouse = THREE.Vector2 & {
  //   x: number;
  //   y: number;
  // };
  
  // const intersectObjectList = ( event: MouseEvent): THREE.Intersection<THREE.Object3D<THREE.Event>>[] => {
    //   const mouse: Mouse = new THREE.Vector2(); 
    //   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    //   raycaster.setFromCamera(mouse, camera);
    //   const intersects = raycaster.intersectObjects(sceneMeshes, false);
    //   return intersects;
    // };
    
    // const teethTransformControl = () => {
      //   const onMouseMove = (event: MouseEvent) => {
        //     const intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = intersectObjectList(event);  
        //     if(intersects.length > 0) intersectedObject = intersects[0].object;
        //     else intersectedObject = null;
//     sceneMeshes.forEach((o: THREE.Mesh, i) => {
//       if(intersectedObject && (o.name === intersectedObject.name)) sceneMeshes[i].material = highlightedMaterial;
//       else sceneMeshes[i].material = material;
//     });
//   };
//   const onDblClick = (event: MouseEvent) => {
  //     const intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = intersectObjectList(event);  
  //     if(intersects.length > 0) {
    //       intersectedObject = intersects[0].object;
    //     }
    //     else intersectedObject = null;
    //     // sceneMeshes.forEach((o: THREE.Mesh, i) => {
      //     //   // console.log(sceneMeshes[i], wrapperList[i]);
      //     //   if(intersectedObject && (o.name === intersectedObject.name)) {
        //     //     console.log(intersectedObject);
        //     //     transformControls.attach(wrapperList[i]);
        //     //   }
        //     //   else transformControls.detach();
        //     // });
        //   };
        //   renderer.domElement.addEventListener("mousemove", onMouseMove, false);
        //   renderer.domElement.addEventListener("dblclick", onDblClick, false);
        // };
        
// teethTransformControl();

// const stats = new Stats();
// document.body.appendChild(stats.dom);

const render = () => {
  renderer.render(scene, camera);
}
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}
window.addEventListener("resize", onWindowResize, false);
const animate = () => {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}
animate();


