import * as THREE from "three";
import SceneInit from "../SceneInit";
import { Arrow, getLocalY } from "../Utils/HelperFunctions";

const CollisionMapping = (main: SceneInit) => {
  const meshes = main.meshes;
  const wrappers = main.wrappers;

  const newMesh = meshes[0];
  const newWrapper = wrappers[0];
  newWrapper.name = "new";
  newMesh.name = "new";

  const mesh = meshes[8];
  const wrapper = wrappers[8];

  const boxGeometry = new THREE.BoxGeometry(10, 3, 10); // Width and height of the box


  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }); 


  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "plainMesh";
  main.scene.add(boxMesh);
  boxMesh.position.set(
    19.976550102233887,
    8.298790097236633,
    -9.983530044555664
  );
  // boxMesh.rotation.set(0,0,0);
  boxMesh.updateMatrixWorld(true); 

  const targetVector = getLocalY(wrapper); // Target vector to check parallelism

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
          new THREE.Vector3(
            positionArray[i],
            positionArray[i + 1],
            positionArray[i + 2]
          )
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
      console.log(mesh.geometry);
      const meshArr: THREE.Object3D[] = [];
      vertexNormals.forEach((normal, i) => {
        const dotProduct = normal.dot(targetVector.normalize());
        if (dotProduct > 0.9) {
          // Arrow(main, wrapper, normal, vertices[i]);
          raycaster.set(vertices[i], normal.normalize());
          const intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] | undefined = raycaster.intersectObject(boxMesh, false);
          if (intersects.length) {
            if(intersects[0].distance > 0) {
              console.log(intersects[0]);
              intersects[0]?.faceIndex && console.log(intersects[0]?.faceIndex % 6);
            }
          }
        }
      });
      console.log(meshArr);
    }
  }
};

export default CollisionMapping;
