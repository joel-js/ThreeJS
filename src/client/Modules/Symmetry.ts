import SceneInit from "../SceneInit";
import * as THREE from 'three';

export class Symmetry {
  private main: SceneInit;
  private linkCount: number;
  private intersects: THREE.Intersection[]
  constructor(main: SceneInit) {
    this.main = main;
    this.linkCount = 0;
    this.intersects = [];
    this.execute =  this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
  }

  private onMouseDoubleClick(event: MouseEvent) {
    this.linkCount++;
    this.main.mouse.set(
      (event.clientX / this.main.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.main.renderer.domElement.clientHeight) * 2 + 1
    );
    this.main.raycaster.setFromCamera(this.main.mouse, this.main.camera);

    this.intersects = this.main.raycaster.intersectObjects(
      this.main.meshes,
      false
    );

    if (this.intersects.length > 0) {
      // implement bounding box and get maximum and minimum point
      // make a plain in x direction on that point
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
