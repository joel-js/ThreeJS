import React from "react";
import * as THREE from "three"; // Import Vector3
import { useGeometry } from "../../Context/contextHooks";
import MeshComponent from "../../Components/Meshcomponent";

const Symmetry: React.FC = () => {
  const { geometry } = useGeometry();
  const meshRefs = React.useRef<Array<THREE.Mesh | null>>([]);
  const boundingBox = new THREE.Box3();
  const [topMeshLoc, setTopMeshLoc] = React.useState<THREE.Vector3>(
    new THREE.Vector3()
  );
  const [symmetryMeshEnable, setSymmetryMeshEnable] =
    React.useState<boolean>(false);
  // const [botMeshLoc, setBotMeshLoc] = React.useState()

  const clickHandler = (name: string) => {
    geometry.map((g: THREE.BufferGeometry, i: number) => {
      if (g.name === name) {
        setSymmetryMeshEnable(true);
        const meshRef = meshRefs.current[i];
        meshRef?.geometry.computeBoundingBox();
        boundingBox.copy(meshRef?.geometry.boundingBox || new THREE.Box3());
        boundingBox.applyMatrix4(meshRef?.matrixWorld || new THREE.Matrix4());
        // const helper = new Box3Helper(boundingBox);
        // meshRef?.add(helper);
        const min = boundingBox.min;
        const max = boundingBox.max;
        console.log("Minimum Point:", min);
        console.log("Maximum Point:", max);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        // const top = new Vector3(center.x, max.y, center.z);
        setTopMeshLoc(new THREE.Vector3(center.x, max.y, center.z));
      }
    });
  };

  return (
    <React.Fragment>
      {geometry &&
        geometry.map((g: THREE.BufferGeometry, i: number) => {
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
      {symmetryMeshEnable && (
        <mesh position={topMeshLoc} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 25, 10, 10]} />
          <meshBasicMaterial
            color="white"
            side={THREE.DoubleSide}
            wireframe={true}
          />
        </mesh>
      )}
    </React.Fragment>
  );
};

export default Symmetry;
