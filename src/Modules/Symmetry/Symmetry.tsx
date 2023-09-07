import React, { useRef } from "react";
import { BufferGeometry, Mesh, Box3, Matrix4,PlaneGeometry,MeshBasicMaterial, Box3Helper } from "three"; // Import Vector3
import { useGeometry } from "../../Context/contextHooks";
import MeshComponent from "../../Components/Meshcomponent";

const Symmetry: React.FC = () => {
  const { geometry } = useGeometry();
  const meshRefs = useRef<Array<Mesh | null>>([]);
  const boundingBox = new Box3();


  const clickHandler = (name: string) => {
    geometry.map((g: BufferGeometry, i: number) => {
      if (g.name === name) {
        const meshRef = meshRefs.current[i];
        meshRef?.geometry.computeBoundingBox();
        boundingBox.copy(meshRef?.geometry.boundingBox || new Box3());
        boundingBox.applyMatrix4(meshRef?.matrixWorld || new Matrix4());
        const helper = new Box3Helper(boundingBox);
        meshRef?.add(helper);
        const min = boundingBox.min;
        const max = boundingBox.max;
        console.log("Minimum Point:", min);
        console.log("Maximum Point:", max);
        const maxPoint = max.clone();
        const planeGeometry = new PlaneGeometry(1,1,1,1);
        const planeMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
        const planeMesh = new Mesh(planeGeometry, planeMaterial);
        planeMesh.position.copy(maxPoint);
        // planeMeshRef.current = planeMesh;

        // Add the plane to the scene
        meshRef!.add(planeMesh);


      }
    });
  };

  return (
    <React.Fragment>
      {geometry &&
        geometry.map((g: BufferGeometry, i: number) => {
          return (
            <MeshComponent
              key={g.name}
              color={i === 0 ? 0xff8080 : 0xffffff}
              geometry={g}
              onDoubleClick={() => clickHandler(g.name)}
              ref={(ref) => (meshRefs.current[i] = ref)}
            />
          );
        })}
    </React.Fragment>
  );
};

export default Symmetry;
