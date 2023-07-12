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
    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
  }

  private findTranslateAxis(wrapper: Wrapper): WrapperLocalAxes {
    const name: string = wrapper.name;
    const list = new DoublyLinkedList(VectorMap);
    const { prev, next } = list.getPrevAndNext(name);
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
        // console.log("prev => ", wrapper.position, this.wrappers[i].position);
      }
      if (next && this.wrappers[i].name === next) {
        vector.next = new THREE.Vector3().subVectors(
          this.wrappers[i].position,
          wrapper.position
        );
        // console.log("next => ", this.wrappers[i].position, wrapper.position);
      }
    }
    return vector;
  }

  private getLocalY(wrapper: Wrapper): THREE.Vector3 {
    const worldY  = new THREE.Vector3(0, 1, 0);
    const localY = worldY.applyQuaternion(wrapper.quaternion);
    console.log('localY ', localY);
    return localY;
  }

  private mesial(wrapper: Wrapper) {
    wrapper.position.add(this.findTranslateAxis(wrapper).next.multiplyScalar(0.1));
  }

  private distal(wrapper: Wrapper) {
    wrapper.position.add(this.findTranslateAxis(wrapper).prev.multiplyScalar(0.1));
  }

  private clockWise(wrapper: Wrapper, axes: WrapperLocalAxes) {
    const angle = Math.PI/18;
    const axis = axes.next.normalize();
    wrapper.rotateOnAxis(axis,angle);

  }
  private antiClockWise(wrapper: Wrapper, axes: WrapperLocalAxes){
    const angle = -(Math.PI/18);
    const axis = axes.prev.normalize();
    wrapper.rotateOnAxis(axis,angle);
  }
  private xclockWise(wrapper: Wrapper, axes: THREE.Vector3) {
    const angle = Math.PI/18;
    const axis = axes.normalize();
    console.log('xclockWise: axis angle', axis, angle);
    wrapper.rotateOnAxis(axis,angle);

  }
  private xantiClockWise(wrapper: Wrapper, axes: THREE.Vector3){
    const angle = -Math.PI/18;
    const axis = axes.normalize();
    console.log('xantiClockWise: axis angle', axis, angle);
    wrapper.rotateOnAxis(axis,angle);
  }
  private moveTeeth(wrapper: Wrapper) {
    if (this.keydownListener) {
      window.removeEventListener("keydown", this.keydownListener);
    }

    this.keydownListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          this.mesial(wrapper);
          break;
        case "s":
          this.distal(wrapper);
          break;
        case "a":
          this.xclockWise(wrapper, this.findTranslateAxis(wrapper).next);
          break;
        case "d":
          this.xantiClockWise(wrapper, this.findTranslateAxis(wrapper).next);
          break;
        case "r":
          this.xclockWise(wrapper, this.getLocalY(wrapper));
          break;
        case "t":
          this.xantiClockWise(wrapper, this.getLocalY(wrapper));
          break;
        case "g":
          this.xclockWise(wrapper, new THREE.Vector3().crossVectors(this.getLocalY(wrapper), this.findTranslateAxis(wrapper).next));
          break;
        case "h":
          this.xantiClockWise(wrapper,new THREE.Vector3().crossVectors(this.getLocalY(wrapper), this.findTranslateAxis(wrapper).next));
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
        // console.log("@dbl", wrapper);
        const vertices = mesh.geometry.attributes.position.array;
        const faces = mesh.geometry.index?.array;
        // console.log('faces', faces);
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
