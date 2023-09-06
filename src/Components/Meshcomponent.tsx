import React from "react";
import { Mesh } from "three";
import { BufferGeometry } from "three";
import { ThreeEvent } from "@react-three/fiber";

type props = {
  color: number;
  geometry: BufferGeometry;
  onDoubleClick?: (event: ThreeEvent<MouseEvent>) => void;
};

const MeshComponent = ({
  color,
  geometry,
  onDoubleClick = () => {},
}: props) => {
  const ref = React.useRef<Mesh>(null);
  return (
    <mesh ref={ref} onDoubleClick={onDoubleClick}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
export default MeshComponent;
