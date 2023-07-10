import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../../SceneInit";
import { rt, Mouse } from "../../Utils/types";

class CustomController {
  private main: SceneInit;
  private meshes: Array<THREE.Mesh>;
  private wrappers: Array<THREE.Group>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;

  constructor(main: SceneInit, { meshes, wrappers }: rt) {
    this.main = main;
    this.meshes = meshes;
    this.wrappers = wrappers;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.intersectObject = null;
    this.selectWrapper = this.selectWrapper.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
  }

  private onMouseDoubleClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.main.camera);

    this.intersects = this.raycaster.intersectObjects(this.wrappers, true);

    if (this.intersects.length > 0) {
      this.intersectObject = this.intersects[0].object;
    } else {
      this.intersectObject = null;
    }
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];
      const wrapper = this.wrappers[i];
      if (this.intersectObject && this.intersectObject.name === mesh.name) {
        wrapper.position.add(
          wrapper
            .getWorldDirection(new THREE.Vector3(10, 5, 7.5))
            .multiplyScalar(10)
        );
        // = CustomController(main,{meshes: [cube], wrappers: [cubeWrapper]});

        break;
      }
    }
  }
  public selectWrapper() {
    this.main.renderer.domElement.addEventListener(
      "dblclick",
      this.onMouseDoubleClick,
      false
    );
  }
}
export default CustomController;
