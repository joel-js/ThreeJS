import * as THREE from "three";
import { Mouse, rt } from "./types";
import SceneInit from "../SceneInit";
import TransformControl from "../Controls/TransformControl";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

class MouseEvents {
  private main: SceneInit;
  private meshes: Array<THREE.Mesh>;
  private wrappers: Array<THREE.Group>;
  private ogMaterial: Array<THREE.MeshBasicMaterial>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private transformControl: TransformControls;
  constructor(main: SceneInit, { meshes, wrappers }: rt) {
    this.main = main;
    this.meshes = meshes;
    this.wrappers = wrappers;
    this.ogMaterial = meshes.map(
      (mesh) => mesh.material as THREE.MeshBasicMaterial
    );
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.intersectObject = null;
    this.transformControl = TransformControl(this.main);
    this.highLight = this.highLight.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.set(
      (event.clientX / this.main.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.main.renderer.domElement.clientHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouse, this.main.camera);
    this.intersects = this.raycaster.intersectObjects(this.meshes, false);
    if (this.intersects.length > 0) {
      this.intersectObject = this.intersects[0].object;
    } else {
      this.intersectObject = null;
    }
    this.meshes.forEach((mesh: THREE.Mesh, i: number) => {
      if (this.intersectObject && this.intersectObject.name === mesh.name) {
        mesh.material = new THREE.MeshBasicMaterial({ wireframe: true });
      } else {
        mesh.material = this.ogMaterial[i];
      }
    });
  }

  public highLight(): void {
    this.main.renderer.domElement.addEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );
  }
}

export default MouseEvents;
