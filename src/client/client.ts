import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import plyLoader from "./Loaders/plyLoader";
import { files } from "./Utils/plyFilePath";
import TransformControl from "./Controls/TransformControl";
import SceneInit from "./SceneInit";
import { ambientLight, directionalLight } from "./Lights/light";
import { rt } from "./Utils/types";
import * as dat from "dat.gui";

const gui = new dat.GUI();
const teethColors = gui.addFolder("Teeth Colors");
const options = {
  teethColors: true,
};
// teethColors.add()

const client = new SceneInit();
client.initialize();

client.scene.add(new THREE.AxesHelper(25));
// client.scene.add(new THREE.DirectionalLight());
client.scene.add(directionalLight);
client.scene.background = new THREE.Color(0xc9c9d9);

const mainWrapper = new THREE.Group();

const sceneMeshes: THREE.Mesh[] = [];
const texture = new THREE.TextureLoader().load("texture/gum_texture.jpeg");

const material = new THREE.MeshLambertMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
});
const gumMaterial = new THREE.MeshLambertMaterial({
  color: 0xfa8072,
  side: THREE.DoubleSide,
});

function updateLightWithCamera() {
  directionalLight.position.copy(client.camera.position);
  directionalLight.target.position.copy(
    client.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1)
  );
}

const orbitControls = new OrbitControls(
  client.camera,
  client.renderer.domElement
);
const transformControls = TransformControl(client, [orbitControls]);

const meshes: THREE.Mesh[] = [];
const meshWrappers: THREE.Group[] = [];

const main = (result: rt) => {
  result.wrappers.forEach((wrapper) => mainWrapper.add(wrapper));
  gui.add(options, "teethColors").onChange((value: boolean) => {
    result.meshes.forEach((item) => {
      if (item.name == "_gum.ply") {
        item.material = new THREE.MeshLambertMaterial({
          color: 0xfa8072,
          side: THREE.DoubleSide,
        });
        
      } else {
        item.material = new THREE.MeshLambertMaterial({
          vertexColors: value,
          side: THREE.DoubleSide,
        });
      }
    });
  });
};

plyLoader(files, meshes, meshWrappers, [material, gumMaterial])
  .then((result) => {
    main(result);
  })
  .catch((error) => {
    console.error("Error loading PLY models:", error);
  });
client.scene.add(mainWrapper);

const stats = new Stats();

const animate = (): void => {
  requestAnimationFrame(animate);
  updateLightWithCamera();
  orbitControls.update();
  client.render();
  stats.update();
};
animate();
