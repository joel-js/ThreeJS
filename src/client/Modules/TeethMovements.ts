import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { rt, Mouse, Mesh, Wrapper, WrapperLocalAxes } from "../Utils/types";
import { VectorMap } from "../Utils/constants";
import { DoublyLinkedList } from "../Utils/HelperFunctions";
class TeethMovements {
  private main: SceneInit;
  private meshes: Array<Mesh>;
  private wrappers: Array<Wrapper>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private otherControls: (OrbitControls | TransformControls)[];
  private keydownListener: ((event: KeyboardEvent) => void) | null;
  private keyPressed:string ;
  constructor(
    main: SceneInit,
    { meshes, wrappers }: rt,
    otherControls?: (OrbitControls | TransformControls)[]
  ) {
    this.main = main;
    this.meshes = meshes;
    this.wrappers = wrappers;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.intersectObject = null;
    this.otherControls = otherControls || [];
    this.keydownListener = null;
    this.keyPressed = '';
    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
    this.mesial = this.mesial.bind(this);
    this.distal = this.distal.bind(this);
    this.clockWise = this.clockWise.bind(this);
    this.antiClockWise = this.antiClockWise.bind(this);
  }

  private findTranslateAxis(wrapper: Wrapper): WrapperLocalAxes {
    const name: string = wrapper.name;
    const list = new DoublyLinkedList(VectorMap);
    const { prev, next } = list.getPrevAndNext(name);
    console.log("prev, next", { prev, next });
    const vector: WrapperLocalAxes = {
      prev: new THREE.Vector3(),
      next: new THREE.Vector3(),
    };
    for (let i = 0; i < this.wrappers.length; i++) {
      if (prev && this.wrappers[i].name === prev) {
        vector.prev = new THREE.Vector3().subVectors(
          this.wrappers[i].position,
          wrapper.position
        );
        console.log("prev => ", wrapper.position, this.wrappers[i].position);
      }
      if (next && this.wrappers[i].name === next) {
        vector.next = new THREE.Vector3().subVectors(
          this.wrappers[i].position,
          wrapper.position
        );
        console.log("next => ", this.wrappers[i].position, wrapper.position);
      }
    }
    return vector;
  }

  private mesial(wrapper: Wrapper) {
    console.log("here@mesial", wrapper.position);
    wrapper.position.add(this.findTranslateAxis(wrapper).next.multiplyScalar(0.1));
    console.log("here@mesial2", wrapper.position);
  }
  private distal(wrapper: Wrapper) {
    console.log(
      "here@distal",
      wrapper.position,
      wrapper.getWorldDirection(new THREE.Vector3(0, 0, 0))
    );
    this.findTranslateAxis(wrapper);
    wrapper.position.add(this.findTranslateAxis(wrapper).prev.multiplyScalar(0.1));
    console.log("here@distal2", wrapper.position);
  }

  private clockWise(wrapper: Wrapper, axes: WrapperLocalAxes) {
    const angle = Math.PI/18;
    const axis = axes.next.normalize();
    // const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    // wrapper.children[0].quaternion.multiplyQuaternions(quaternion, wrapper.children[0].quaternion);
    wrapper.rotateOnAxis(axis,angle);

  }
  private antiClockWise(wrapper: Wrapper, axes: WrapperLocalAxes){
    const angle = -Math.PI/18;
    const axis = axes.next.normalize();
    // const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    // wrapper.children[0].quaternion.multiplyQuaternions(quaternion, wrapper.children[0].quaternion);
    wrapper.rotateOnAxis(axis,angle);
  }

  private moveTeeth(wrapper: Wrapper) {
    if (this.keydownListener) {
      console.log('x =>',this.keydownListener);
      window.removeEventListener("keydown", this.keydownListener);
    }

    this.keydownListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          this.keyPressed = 'w';
          this.mesial(wrapper);
          break;
        case "s":
          console.log(this.keyPressed)
          this.distal(wrapper);
          break;
        case "a":
          this.clockWise(wrapper, this.findTranslateAxis(wrapper));
          break;
        case "d":
          this.antiClockWise(wrapper, this.findTranslateAxis(wrapper));
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
        console.log("@dbl", wrapper);
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
