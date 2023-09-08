import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useGeometry } from "../../Context/contextHooks";
import MeshComponent from "../../Components/Meshcomponent";

const Symmetry: React.FC = () => {
  const { geometry } = useGeometry();
  const { camera, gl } = useThree();
  const meshRefs = React.useRef<Array<THREE.Mesh | null>>([]);
  const boundingBox = new THREE.Box3();
  const [symmetryMeshEnable, setSymmetryMeshEnable] =
    React.useState<boolean>(false);
  const [topMeshLocation, setTopMeshLocation] = React.useState<THREE.Vector3>(
    new THREE.Vector3()
  );
  const [bottomMeshLocation, setBottomMeshLocation] = React.useState<THREE.Vector3>(new THREE.Vector3());

  const clickHandler = (name: string) => {
    const perspective = camera.clone();
    console.log(perspective);
    const orthoCamera = new THREE.OrthographicCamera(
      gl.domElement.clientWidth / -2,
      gl.domElement.clientWidth / 2,
      gl.domElement.clientHeight / 2,
      gl.domElement.clientHeight / -2,
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    orthoCamera.position.set(0, 0, 5); // Adjust the position as needed
    orthoCamera.lookAt(0, 0, 0); // Adjust the target as needed
    
    // Replace the current camera with the new orthographic camera
    // camera.copy(orthoCamera);
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
        setTopMeshLocation(new THREE.Vector3(center.x, max.y, center.z));
        setBottomMeshLocation(new THREE.Vector3(center.x, min.y, center.z));
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
        <mesh position={topMeshLocation} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50, 10, 10]} />
          <meshBasicMaterial
            color="white"
            side={THREE.DoubleSide}
            wireframe={true}
          />
        </mesh>
      )}
      {symmetryMeshEnable && (
        <mesh position={bottomMeshLocation} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50, 10, 10]} />
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
