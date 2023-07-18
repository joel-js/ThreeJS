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


  const planeGeometry = new THREE.PlaneGeometry(10, 10); // Width and height of the plane

  // Create the material
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: 2,
  }); // Specify the color of the plane

  // Create the mesh
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  planeMesh.position.set(
    wrapper.position.x,
    wrapper.position.y + 4,
    wrapper.position.z
  ); // Set the position at the origin
  planeMesh.rotation.set(Math.PI / -2, 0, 0);
  main.scene.add(planeMesh);


  // newWrapper.position.set(
  //   wrapper.position.x,
  //   wrapper.position.y + 8.5,
  //   wrapper.position.z
  // );
  // console.log(newMesh);
  // newWrapper.rotateY(Math.PI/6)
  // Arrow(main, wrapper, getLocalY(wrapper));

  // const mesh = ...; // Your three.js mesh object
  const targetVector = getLocalY(wrapper); // Target vector to check parallelism

  const geometry = mesh.geometry;
  // console.log(mesh.geometry);
  const parallelNormals = [];
  if (geometry.isBufferGeometry) {
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    const indexArray = geometry.index?.array || [];

    if (positionAttribute && normalAttribute && indexArray) {
      const positionArray = positionAttribute.array;
      const vertexNormalArray = normalAttribute.array;
      const vertices: Array<THREE.Vector3> = [];
      const vertexNormals = [];
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
      vertexNormals.forEach((normal, i) => {
        const dotProduct = normal.dot(targetVector.normalize());
        if(dotProduct > 0.9) {
          Arrow(main, wrapper, normal, vertices[i]);
          raycaster.set(vertices[i], normal.normalize());
          console.log(planeMesh);
          const intersects = raycaster.intersectObject(planeMesh, false);
          // console.log(raycaster);
          console.log(intersects);
        }
      });
      // const faceCount = indexArray.length / 3; // Assuming each face has 3 vertices
      // for (let faceIndex = 0; faceIndex < faceCount; faceIndex += 3) {
      //   // TODO revise normal calc later
      //   const vertexNormal = new THREE.Vector3(
      //     vertexNormalArray[faceIndex],
      //     vertexNormalArray[faceIndex + 1],
      //     vertexNormalArray[faceIndex + 2]
      //   );
      //   // console.log('normal ', normal);

      //   // Arrow(main, wrapper, normal)
      //   // Check parallelism between the face normal and the target vector
      //   const dotProduct = vertexNormal.dot(targetVector.normalize());

      //   if (dotProduct > 0.6) {
      //     // Face vertexNormal is similar in direction to the target vector
      //     parallelNormals.push(vertexNormal);
      //   }
      // }
      // console.log('here',parallelNormals);
      // console.log(vertices.length);
      vertices.forEach((vertex, i) => {});
      // parallelNormals.forEach(normal => {
      //   raycaster.set
      // Arrow(main, wrapper, normal)
      // })
    }
  }
  

  const raycaster = new THREE.Raycaster();
  for (let i = 0; i < parallelNormals.length; i++) {
    // const origin = mesh.geometry.faces[faceIndex1].centroid;
  }
  // raycaster

  // const meshVertices = mesh.geometry.attributes.position.array;
  // const newMeshVertices = newMesh.geometry.attributes.position.array;
  // for(let i=0; i<newMeshVertices.length; i++){
  //   console.log(meshVertices[i]);
  // }
  // const newMeshFaces = newMesh.geometry?.index?.array;

  // if(newMeshFaces){
  //   console.log(newMeshFaces.length);
  //   for(let i=0; i<newMeshFaces.length-3; i+=3){
  //     console.log(newMeshFaces[i],newMeshFaces[i+1],newMeshFaces[i+2]);
  //   }
  // }

  // console.log(newMesh.);
  // Assuming you have two sets of vertices: meshVertices and newMeshVertices

  const intersectedFaces = [];

  // // Iterate over the faces of the first mesh
  // for (let i = 0; i < meshFaces.length; i++) {
  //   const meshFace = meshFaces[i];
  //   const [vertexIndex1, vertexIndex2, vertexIndex3] = meshFace;

  //   const vertex1 = new THREE.Vector3().fromArray(meshVertices, vertexIndex1 * 3);
  //   const vertex2 = new THREE.Vector3().fromArray(meshVertices, vertexIndex2 * 3);
  //   const vertex3 = new THREE.Vector3().fromArray(meshVertices, vertexIndex3 * 3);

  //   const meshFacePlane = new THREE.Plane().setFromCoplanarPoints(vertex1, vertex2, vertex3);

  //   // Iterate over the faces of the second mesh
  //   for (let j = 0; j < newMeshFaces.length; j++) {
  //     const newMeshFace = newMeshFaces[j];
  //     const [newVertexIndex1, newVertexIndex2, newVertexIndex3] = newMeshFace;

  //     const newVertex1 = new THREE.Vector3().fromArray(newMeshVertices, newVertexIndex1 * 3);
  //     const newVertex2 = new THREE.Vector3().fromArray(newMeshVertices, newVertexIndex2 * 3);
  //     const newVertex3 = new THREE.Vector3().fromArray(newMeshVertices, newVertexIndex3 * 3);

  //     // Check if the face plane intersects with the new mesh face
  //     if (
  //       meshFacePlane.intersectsTriangle(newVertex1, newVertex2, newVertex3) ||
  //       meshFacePlane.intersectsTriangle(newVertex3, newVertex2, newVertex1)
  //     ) {
  //       intersectedFaces.push([meshFace, newMeshFace]);
  //     }
  //   }
  // }

  // console.log("Intersected Faces:", intersectedFaces);

  // console.log(mesh.geometry);

  // const xcontrols = {
  //   positionY: planeMesh.position.y,
  // };

  // // console.log('what',main.gui)
  // const controls = {
  //   move: false,
  // };

  // main.gui.add(xcontrols, 'positionY', -10, 10, 0.001).name('move').onChange((val) => planeMesh.position.y = val);
};

export default CollisionMapping;
