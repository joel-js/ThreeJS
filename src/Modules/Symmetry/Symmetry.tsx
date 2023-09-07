import React, { useRef } from "react";
import { BufferGeometry, Mesh, Box3, Matrix4,PlaneGeometry,MeshBasicMaterial, Box3Helper,Vector3 } from "three"; // Import Vector3
import { useGeometry } from "../../Context/contextHooks";
import MeshComponent from "../../Components/Meshcomponent";

const Symmetry: React.FC = () => {
  const { geometry } = useGeometry();
  const meshRefs = useRef<Array<Mesh | null>>([]);
  const boundingBox = new Box3();
  let planeMesh : THREE.Mesh | undefined;

  const clickHandler = (name: string) => {

    geometry.map((g: BufferGeometry, i: number) => {
      const meshRef = meshRefs.current[i];
      if(planeMesh) meshRef?.remove(planeMesh)
      if (g.name === name) {
        meshRef?.geometry.computeBoundingBox();
        boundingBox.copy(meshRef?.geometry.boundingBox || new Box3());
        boundingBox.applyMatrix4(meshRef?.matrixWorld || new Matrix4());
        const helper = new Box3Helper(boundingBox);
        meshRef?.add(helper);
        const min = boundingBox.min;
        const max = boundingBox.max;
        console.log("Minimum Point:", min);
        console.log("Maximum Point:", max);
        const center = new Vector3();
        boundingBox.getCenter(center);
        const top  = new Vector3(center.x,max.y,center.z);
        // const maxPoint = max.clone();
        const planeGeometry = new PlaneGeometry(100,25,25,10);
        const planeMaterial = new MeshBasicMaterial({ wireframe: true });
        planeMesh = new Mesh(planeGeometry, planeMaterial);
        planeMesh.position.copy(top);
        planeMesh.rotation.x = -Math.PI / 2;
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
