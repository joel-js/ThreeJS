import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { Wrapper, V3, commonIndexType } from "../Utils/types";
import {
  findTranslateAxis,
  getLocalY,
  xclockWise,
  xantiClockWise,
  negativeVector,
  prevNext,
  retrieveTransformCoord,
} from "../Utils/HelperFunctions";
import { map, wrap } from "lodash";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { initial_State } from "../State/MaterialState";

let commonIndicesGlobal: { [key: string]: commonIndexType[] } = {};
const THRESHOLD: number = 0.5;

const updateTissue = (
  mesh: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[]
  >,
  gum: THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[]
  >
) => {
  let teethCoord = retrieveTransformCoord(
    <THREE.BufferAttribute>mesh.geometry.attributes.position,
    mesh.matrixWorld
  );
  const gumVertices: V3[] = [];
  const posAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>(
    gum.geometry.getAttribute("position")
  );
  commonIndicesGlobal[mesh.name].forEach((el) => {
    let { gum_idx, tooth_idx } = el;
    posAttribute.setXYZ(
      gum_idx,
      teethCoord[tooth_idx].x,
      teethCoord[tooth_idx].y,
      teethCoord[tooth_idx].z
    );
  });
  gum.geometry.setAttribute("position", posAttribute);
  gum.geometry.attributes.position.needsUpdate = true;
};

class TeethMovements {
  private main: SceneInit;
  private buccalLigualAxis: { [key: string]: V3 };
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
    this.buccalLigualAxis = { "": new THREE.Vector3() };
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

  private extrude(wrapper: Wrapper) {
    const localY: V3 = getLocalY(wrapper);
    const MOVEMENT: number = 0.5;
    wrapper.position.add(localY.multiplyScalar(MOVEMENT));
  }
  private intrude(wrapper: Wrapper) {
    const localY: V3 = getLocalY(wrapper);
    const MOVEMENT: number = -0.5;
    wrapper.position.add(localY.multiplyScalar(MOVEMENT));
  }

  private moveTeeth(wrapper: Wrapper) {
    if (this.keydownListener) {
      window.removeEventListener("keydown", this.keydownListener);
    }

    let mesh = <THREE.Mesh>wrapper.children[0];
    let gum = <THREE.Mesh>this.main.wrappers[0].children[0];
    let gumWorldCoord = retrieveTransformCoord(
      <THREE.BufferAttribute>gum.geometry.attributes.position,
      gum.matrixWorld
    );
    let meshWorldCoord = retrieveTransformCoord(
      <THREE.BufferAttribute>mesh.geometry.attributes.position,
      mesh.matrixWorld
    );
    // TODO func for finding common vertices based on proximity into helper
    if (!commonIndicesGlobal[mesh.name]) {
      let commonIndices: commonIndexType[] = [];
      gumWorldCoord.forEach((el1, idx1) => {
        meshWorldCoord.forEach((el2, idx2) => {
          if (el1.distanceTo(el2) < THRESHOLD) {
            commonIndices.push({
              gum_idx: idx1,
              tooth_idx: idx2,
            });
          }
        });
      });
      commonIndicesGlobal[mesh.name] = commonIndices;
    }

    this.keydownListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          this.mesial(wrapper);
          updateTissue(mesh, gum);

          break;
        case "s":
          this.distal(wrapper);
          updateTissue(mesh, gum);

          break;
        case "a":
          this.buccal(wrapper);
          updateTissue(mesh, gum);

          break;
        case "d":
          this.ligual(wrapper);
          updateTissue(mesh, gum);

          break;
        case "z":
          xclockWise(
            wrapper,
            findTranslateAxis(this.main.wrappers, wrapper).next
          );
          updateTissue(mesh, gum);

          break;
        case "x":
          xantiClockWise(
            wrapper,
            findTranslateAxis(this.main.wrappers, wrapper).next
          );
          updateTissue(mesh, gum);

          break;
        case "r":
          xclockWise(wrapper, getLocalY(wrapper));
          updateTissue(mesh, gum);

          break;
        case "t":
          xantiClockWise(wrapper, getLocalY(wrapper));
          updateTissue(mesh, gum);

          break;
        case "g":
          xclockWise(
            wrapper,
            new THREE.Vector3().crossVectors(
              getLocalY(wrapper),
              findTranslateAxis(this.main.wrappers, wrapper).next
            )
          );
          updateTissue(mesh, gum);

          break;
        case "h":
          xantiClockWise(
            wrapper,
            new THREE.Vector3().crossVectors(
              getLocalY(wrapper),
              findTranslateAxis(this.main.wrappers, wrapper).next
            )
          );
          updateTissue(mesh, gum);

          break;
        case "i":
          this.extrude(wrapper);
          let gumCommonIndices: number[] = [];

          let gumCommonIndicesArray: [] = commonIndicesGlobal?.[
            mesh.name
          ] as [];
          // removing duplicate indices
          for (let i = 0; i < gumCommonIndicesArray.length; i++) {
            const gumIndex: number = gumCommonIndicesArray[i]?.["gum_idx"];
            if (gumCommonIndices.indexOf(gumIndex) === -1) {
              gumCommonIndices.push(gumIndex);
            }
          }
          // console.log(gumCommonIndices);
          const commonGumVertices: V3[] = [];
          const positionAttribute: THREE.BufferAttribute =
            gum.geometry.getAttribute("position") as THREE.BufferAttribute;

          gumCommonIndices.forEach((i) => {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            commonGumVertices.push(vertex);
          });
          // const commonGumVerticesArray = [];
          // for (let i = 0; i < commonGumVertices.length; i+=3) {
          //   console.log(commonGumVerticesArray[i]);
          //   commonGumVerticesArray[i] = commonGumVertices[i].x;
          //   commonGumVerticesArray[i+ 1] = commonGumVertices[i].y;
          //   commonGumVerticesArray[i+ 2] = commonGumVertices[i].z;
          // }
          // var polygon = new ConvexGeometry(commonGumVertices);

          // const polyMesh = new THREE.Mesh(polygon, new THREE.MeshLambertMaterial({...initial_State.gum.material, wireframe: true}))
          // var newGeo = BufferGeometryUtils.mergeGeometries([polyMesh.geometry, polygon])
          // const mesh2 = new THREE.Mesh(newGeo, new THREE.MeshLambertMaterial({...initial_State.gum.material, wireframe: true}))
          // this.main.scene.add(polyMesh)
          // this.main.scene.add(mesh2)

          const curve = new THREE.CatmullRomCurve3(commonGumVertices);
          const points = curve.getPoints(5000);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

          // Create the final object to add to the scene
          const curveObject = new THREE.Line(geometry, material);
          // this.main.scene.add(curveObject);

          var polygon = new ConvexGeometry(points);

          const polyMesh = new THREE.Mesh(
            polygon,
            new THREE.MeshLambertMaterial({
              ...initial_State.gum.material,
              wireframe: false,
            })
          );
          // var newGeo = BufferGeometryUtils.mergeGeometries([
          //   polyMesh.geometry,
          //   polygon,
          // ]);
          // const mesh2 = new THREE.Mesh(
          //   newGeo,
          //   new THREE.MeshLambertMaterial({
          //     ...initial_State.gum.material,
          //     wireframe: false,
          //   })
          // );
          this.main.scene.add(polyMesh);
          // this.main.scene.add(mesh2);

          this.main.scene.remove(mesh);

          // let reverseGumCommonIndices: number[] = gumCommonIndices.reverse();
          // const posAttribute: THREE.BufferAttribute = <THREE.BufferAttribute>(
          //   gum.geometry.getAttribute("position")
          // );

          // // connect each points in commonGumVerices using commonGumIndex

          // // console.log(posAttribute);

          // // commonIndicesGlobal[mesh.name].forEach(el => {
          // //   let { gum_idx, tooth_idx } = el;
          // //   posAttribute.setXYZ(gum_idx, teethCoord[tooth_idx].x, teethCoord[tooth_idx].y, teethCoord[tooth_idx].z);
          // // });
          // gum.geometry.setAttribute("position", posAttribute);
          // gum.geometry.attributes.position.needsUpdate = true;
          break;
        case "k":
          this.intrude(wrapper);
          break;
      }
    };
    window.addEventListener("keydown", this.keydownListener);
  }

  private onMouseDoubleClick(event: MouseEvent): void {
    this.main.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.main.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.main.raycaster.setFromCamera(this.main.mouse, this.main.camera);

    this.intersects = this.main.raycaster.intersectObjects(
      this.main.wrappers,
      true
    );

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
