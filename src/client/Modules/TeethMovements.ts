import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { rt, Mouse } from "../Utils/types";

class TeethMovements {
  private main: SceneInit;
  private meshes: Array<THREE.Mesh>;
  private wrappers: Array<THREE.Group>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private otherControls: (OrbitControls | TransformControls)[];
  private keydownListener: ((event: KeyboardEvent) => void) | null;

  constructor(main: SceneInit, { meshes, wrappers }: rt, otherControls ?: (OrbitControls | TransformControls)[]) {
    this.main = main;
    this.meshes = meshes;
    this.wrappers = wrappers;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.intersectObject = null;
    this.otherControls = otherControls || [];
    this.keydownListener = null;

    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
    this.mesial = this.mesial.bind(this);
    this.distal = this.distal.bind(this);
  }

  private mesial(wrapper: THREE.Group) {
    console.log('here@mesial', wrapper.position,  wrapper.getWorldDirection(new THREE.Vector3(0, 0, 5)));
    wrapper.position.add(new THREE.Vector3(0, 0, 5));
    console.log('here@mesial2', wrapper.position);

  }
  private distal(wrapper: THREE.Group) {
    console.log('here@distal', wrapper.position,  wrapper.getWorldDirection(new THREE.Vector3(0, 0, 0)));
    wrapper.position.add(new THREE.Vector3(0, 5, 5));
    console.log('here@distal2', wrapper.position);
  }

  private moveTeeth(wrapper: THREE.Group) {
    if (this.keydownListener) {
      window.removeEventListener("keydown", this.keydownListener);
    }

    this.keydownListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          this.mesial(wrapper);
          break;
        case "ArrowDown":
          this.distal(wrapper);
          break;
      }
    };
    window.addEventListener("keydown", this.keydownListener);
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
        console.log('@dbl', wrapper);
        // const vertices = mesh.geometry.attributes.position.array;
        // const faces = mesh.geometry.index?.array;
        this.moveTeeth(wrapper);
        
        break;
      }
    }
  }
  public execute() {
    this.main.renderer.domElement.addEventListener(
      "dblclick",
      this.onMouseDoubleClick,
      false
    );
  }
}
export default TeethMovements;
