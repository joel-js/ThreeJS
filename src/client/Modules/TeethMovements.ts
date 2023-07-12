import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { rt, Mouse, Mesh, Wrapper, V3 } from "../Utils/types";
import {
  findTranslateAxis,
  getLocalY,
  xclockWise,
  xantiClockWise,
  negativeVector,
} from "../Utils/HelperFunctions";

class TeethMovements {
  private main: SceneInit;
  private meshes: Array<Mesh>;
  private wrappers: Array<Wrapper>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private buccalLigualAxis: V3;
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
    this.buccalLigualAxis = new THREE.Vector3();
    this.keydownListener = null;
    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
  }

  private mesial(wrapper: Wrapper) {
    wrapper.position.add(
      findTranslateAxis(this.wrappers, wrapper).next.multiplyScalar(0.1)
    );
  }

  private distal(wrapper: Wrapper) {
    wrapper.position.add(
      findTranslateAxis(this.wrappers, wrapper).prev.multiplyScalar(0.1)
    );
  }

  private buccal(wrapper: Wrapper) {
    const buccalAxis: V3 = new THREE.Vector3()
      .crossVectors(
        getLocalY(wrapper),
        findTranslateAxis(this.wrappers, wrapper).next
      )
      .normalize();
    console.log("buccal", buccalAxis);
    if (this.buccalLigualAxis.length() === 0) {
      this.buccalLigualAxis = buccalAxis;
    }
    wrapper.position.add(this.buccalLigualAxis);
  }

  private ligual(wrapper: Wrapper) {
    const ligualAxis: V3 = new THREE.Vector3().crossVectors(
      getLocalY(wrapper),
      findTranslateAxis(this.wrappers, wrapper).next.normalize()
    );
    if (this.buccalLigualAxis.length() === 0) {
      this.buccalLigualAxis = ligualAxis;
    }
    wrapper.position.add(negativeVector(this.buccalLigualAxis));
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
          this.buccal(wrapper);
          break;
        case "d":
          this.ligual(wrapper);
          break;
        case "z":
          xclockWise(wrapper, findTranslateAxis(this.wrappers, wrapper).next);
          break;
        case "x":
          xantiClockWise(
            wrapper,
            findTranslateAxis(this.wrappers, wrapper).next
          );
          break;
        case "r":
          xclockWise(wrapper, getLocalY(wrapper));
          break;
        case "t":
          xantiClockWise(wrapper, getLocalY(wrapper));
          break;
        case "g":
          xclockWise(
            wrapper,
            new THREE.Vector3().crossVectors(
              getLocalY(wrapper),
              findTranslateAxis(this.wrappers, wrapper).next
            )
          );
          break;
        case "h":
          xantiClockWise(
            wrapper,
            new THREE.Vector3().crossVectors(
              getLocalY(wrapper),
              findTranslateAxis(this.wrappers, wrapper).next
            )
          );
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
