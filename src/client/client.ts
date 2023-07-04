import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const raycaster: THREE.Raycaster = new THREE.Raycaster();
const sceneMeshes: THREE.Mesh[] = [];
let intersectedObject: THREE.Object3D | null;
const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {};


const group: THREE.Group = new THREE.Group();
group.position.set(0, 0, 4);

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
const material = new THREE.MeshNormalMaterial({ transparent: true });

const highlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});

const cube1: THREE.Mesh = new THREE.Mesh(geometry, material);
cube1.position.set(0, 0, 0);
cube1.name = "cube1";
group.add(cube1);
sceneMeshes.push(cube1);
// scene.add(cube1);

const cube2: THREE.Mesh = new THREE.Mesh(geometry, material);
cube2.position.set(0, 4, 0);
cube2.name = "cube2";
group.add(cube2);
sceneMeshes.push(cube2);
// scene.add(cube2);
scene.add(group);

// console.dir(group);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode("rotate");
scene.add(transformControls);

transformControls.addEventListener("dragging-changed", function (event) {
  orbitControls.enabled = !event.value;
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
    
    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }
    
    type Mouse = THREE.Vector2 & {
      x: number;
      y: number;
    };
    
    const intersectObjectList = ( event: MouseEvent): THREE.Intersection<THREE.Object3D<THREE.Event>>[] => {
      const mouse: Mouse = new THREE.Vector2(); 
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(sceneMeshes, false);
  return intersects;
};


// const onDblClick = (event: MouseEvent) => {
  //   setMouseCoordinate(mouse2, event);
  //   raycaster.setFromCamera(mouse2, camera);
  //   const intersects = raycaster.intersectObjects(sceneMeshes, false);
  // };
  const teethTransformControl = () => {
    const onMouseMove = (event: MouseEvent) => {
      const intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = intersectObjectList(event);  
      if(intersects.length > 0) intersectedObject = intersects[0].object;
      else intersectedObject = null;
      sceneMeshes.forEach((o: THREE.Mesh, i) => {
        if(intersectedObject && (o.name === intersectedObject.name)) sceneMeshes[i].material = highlightedMaterial;
        else sceneMeshes[i].material = material;
      });
    };
    const onDblClick = (event: MouseEvent) => {
      const intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = intersectObjectList(event);  
      if(intersects.length > 0) intersectedObject = intersects[0].object;
      else intersectedObject = null;
      sceneMeshes.forEach((o: THREE.Mesh, i) => {
        if(intersectedObject && (o.name === intersectedObject.name)) transformControls.attach(sceneMeshes[i]);
        // else sceneMeshes[i].material = material;
      });
    };
    renderer.domElement.addEventListener("mousemove", onMouseMove, false);
    renderer.domElement.addEventListener("dblclick", onDblClick, false);
};

teethTransformControl();

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
