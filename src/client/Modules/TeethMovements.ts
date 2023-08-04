import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { Wrapper, V3 } from "../Utils/types";
import {
  findTranslateAxis,
  getLocalY,
  xclockWise,
  xantiClockWise,
  negativeVector,
  prevNext,
  retrieveTransformCoord
} from "../Utils/HelperFunctions";

type commonIndexType = {
  gum_idx: number,
  tooth_idx: number
}

let commonIndicesMap: {
  [key: string]: commonIndexType[]
} = {}

class TeethMovements {
  private main: SceneInit;
  private buccalLigualAxis: { [key: string] : V3 };
  private otherControls: (OrbitControls | TransformControls)[];
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private keydownListener: ((event: KeyboardEvent) => void) | null;

  constructor(
    main: SceneInit,
    otherControls?: (OrbitControls | TransformControls)[]
  ) {
    this.main = main;
    this.otherControls = otherControls || [];
    this.buccalLigualAxis = {"": new THREE.Vector3()}
    this.intersects = [];
    this.intersectObject = null;
    this.keydownListener = null;
    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
  }

  private mesial(wrapper: Wrapper) {
    wrapper.position.add(
      // findTranslateAxis(this.main.wrappers, wrapper).next.multiplyScalar(0.1)
      prevNext(this.main.wrappers, wrapper).multiplyScalar(0.01)
    );
  }

  private distal(wrapper: Wrapper) {
    wrapper.position.add(
      // findTranslateAxis(this.main.wrappers, wrapper).prev.multiplyScalar(0.1)
      prevNext(this.main.wrappers, wrapper).negate().multiplyScalar(0.01)

    );
  }

  private buccal(wrapper: Wrapper) {
    const buccalAxis: V3 = new THREE.Vector3()
      .crossVectors(
        getLocalY(wrapper),
        findTranslateAxis(this.main.wrappers, wrapper).next
      )
      .normalize();
    if (!this.buccalLigualAxis[wrapper.name]) {
      this.buccalLigualAxis[wrapper.name] = buccalAxis;
    }
    wrapper.position.add(this.buccalLigualAxis[wrapper.name]);
  }

  private ligual(wrapper: Wrapper) {
    const ligualAxis: V3 = new THREE.Vector3().crossVectors(
      getLocalY(wrapper),
      findTranslateAxis(this.main.wrappers, wrapper).next.normalize()
    );
    if (!this.buccalLigualAxis[wrapper.name]) {
      this.buccalLigualAxis[wrapper.name] = ligualAxis;
    }
    wrapper.position.add(negativeVector(this.buccalLigualAxis[wrapper.name]));
  }

  private moveTeeth(wrapper: Wrapper) {
    if (this.keydownListener) {
      window.removeEventListener("keydown", this.keydownListener);
    }

    let mesh = <THREE.Mesh> wrapper.children[0]
    let gum = <THREE.Mesh> this.main.wrappers[0].children[0]
    let gumWorldCoord = retrieveTransformCoord((<THREE.BufferAttribute> gum.geometry.attributes.position), gum.matrixWorld)
    let meshWorldCoord = retrieveTransformCoord((<THREE.BufferAttribute> mesh.geometry.attributes.position), mesh.matrixWorld)
    // TODO func for finding common vertices based on proximity into helper
    let commonIndices: commonIndexType[] = []
    gumWorldCoord.forEach( (el1, idx1) => {
      meshWorldCoord.forEach((el2, idx2) => {
        if (el1.distanceTo(el2) < 1) {
          commonIndices.push({
            gum_idx: idx1,
            tooth_idx: idx2
          })
        }
      })
    })
    commonIndicesMap[mesh.name] = commonIndices

    this.keydownListener = (event: KeyboardEvent) => {
      let teethCoord = retrieveTransformCoord((<THREE.BufferAttribute> mesh.geometry.attributes.position), mesh.matrixWorld)
      const gumVertices: V3[] = []
      const posAttribute: THREE.BufferAttribute = <THREE.BufferAttribute> gum.geometry.getAttribute('position')
      commonIndicesMap[mesh.name].forEach(el => {
        let {gum_idx, tooth_idx} = el
        posAttribute.setXYZ(gum_idx, teethCoord[tooth_idx].x, teethCoord[tooth_idx].y, teethCoord[tooth_idx].z)
      })
      gum.geometry.setAttribute('position', posAttribute)
      gum.geometry.attributes.position.needsUpdate = true

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
          xclockWise(wrapper, findTranslateAxis(this.main.wrappers, wrapper).next);
          break;
        case "x":
          xantiClockWise(
            wrapper,
            findTranslateAxis(this.main.wrappers, wrapper).next
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
              findTranslateAxis(this.main.wrappers, wrapper).next
            )
          );
          break;
        case "h":
          xantiClockWise(
            wrapper,
            new THREE.Vector3().crossVectors(
              getLocalY(wrapper),
              findTranslateAxis(this.main.wrappers, wrapper).next
            )
          );
          break;
      }
    };
    window.addEventListener("keydown", this.keydownListener);
  }

  private onMouseDoubleClick(event: MouseEvent): void {
    this.main.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.main.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.main.raycaster.setFromCamera(this.main.mouse, this.main.camera);

    this.intersects = this.main.raycaster.intersectObjects(this.main.wrappers, true);

    if (this.intersects.length > 0) {
      this.intersectObject = this.intersects[0].object;
      // this.intersects[0]
    } else {
      this.intersectObject = null;
    }
    for (let i = 0; i < this.main.meshes.length; i++) {
      const mesh = this.main.meshes[i];
      const wrapper = this.main.wrappers[i];
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
