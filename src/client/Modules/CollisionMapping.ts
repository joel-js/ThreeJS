import * as THREE from "three";
import SceneInit from "../SceneInit";
import { Arrow, getLocalY } from "../Utils/HelperFunctions";
import { Wrapper, Mesh } from "../Utils/types";
import { OccColorMap } from "../Utils/constants";
import { setState } from "../State/MaterialState";


// dist >= 0.7	: no contact -> white
// 0.7 > dist >= 0.2: no contact -> green
// 0.2 > dist >= 0.0 : contact -> blue
// 0.0 > dist >= -0.2 : inside -> pink
// -0.2 > dist > -0.7: inside -> red

class CollisionMapping {
  main: SceneInit;
  meshes: Mesh[];
  wrappers: Wrapper[];
  gui: dat.GUI;
  constructor(main: SceneInit) {
    this.main = main;
    this.meshes = main.meshes;
    this.wrappers = main.wrappers;
    this.gui = main.gui;
  }

  public execute() {
    const mesh = this.meshes[7];
    const wrapper = this.wrappers[7];
    setState(mesh.name, {
      material: () => new THREE.MeshLambertMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1
      })
    })
    const boxGeometry = new THREE.TorusKnotGeometry(3); // Width and height of the box

    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.name = "plainMesh";
    this.main.scene.add(boxMesh);
    boxMesh.position.set(19.976550102233887, 7.298790097236633, -9.983530044555664);
    boxMesh.visible = true;
    boxMesh.updateMatrixWorld(true);

    const targetVector = getLocalY(wrapper); // Target vector to check parallelism

    const controls = {
      positionY: boxMesh.position.y,
    };

    this.gui.add(controls, 'positionY', 0, 12).onChange((val) => {
      boxMesh.position.setY(val);
    })
    .onFinishChange(()=>{
      boxMesh.updateMatrixWorld(true);
      const geometry = mesh.geometry;
      if (geometry.isBufferGeometry) {
        const positionAttribute = geometry.attributes.position;
        const normalAttribute = geometry.attributes.normal;
        const indexArray = geometry.index?.array || [];
  
        if (positionAttribute && normalAttribute && indexArray) {
          const positionArray: ArrayLike<number> = positionAttribute.array;
          const vertexNormalArray: ArrayLike<number> = normalAttribute.array;
          const vertices: Array<THREE.Vector3> = [];
          const vertexNormals: Array<THREE.Vector3> = [];
          for (let i = 0; i < positionArray.length; i += 3) {
            vertices.push(
              new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2])
            );
            vertexNormals.push(
              new THREE.Vector3(
                vertexNormalArray[i],
                vertexNormalArray[i + 1],
                vertexNormalArray[i + 2]
              )
            );
          }
  
          const raycaster = new THREE.Raycaster();
          const colorArray = new Float32Array(positionAttribute.array.length).fill(1);
          console.log("Len ", colorArray.length);
  
          vertexNormals.forEach((normal, i) => {
            const dotProduct = normal.dot(targetVector.normalize());
            if (dotProduct > 0.7) {
              raycaster.set(vertices[i], normal.normalize());
              const intersects: THREE.Intersection[] | undefined = raycaster.intersectObject(
                boxMesh,
                false
                );
                if (intersects.length) {
                const dist: number = intersects[0].distance; 
                  if (6 > dist && dist >= 4) {
                    console.log(OccColorMap.green);
                    colorArray.set(OccColorMap.green, i * 3);
                  }
                  else if( 4 > dist && dist >= 3) {
                    colorArray.set(OccColorMap.cyan, i * 3);
                  }
                  else if( 3 > dist && dist >= 0 ) {
                    colorArray.set(OccColorMap.red, i * 3);
                  }
              }
            }
          });
  
          const colorAttribute = new THREE.Float32BufferAttribute(colorArray, 3);
          mesh.geometry.setAttribute("color", colorAttribute);
          mesh.geometry.attributes.color.needsUpdate = true;
          console.log('color',colorAttribute);
          console.log(
            "cc",
            Array.from(colorArray).filter((color, i) => {
              // if(color !== 0)
              //   console.log(i)
              return color !== 0;
            })
          );
        }
      }
    })

  }
}

export default CollisionMapping;
