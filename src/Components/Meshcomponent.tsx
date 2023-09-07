import React, { forwardRef } from "react";
import { Mesh } from "three";
import { BufferGeometry } from "three";
import { ThreeEvent } from "@react-three/fiber";

type Props = {
  color: number;
  geometry: BufferGeometry;
  onDoubleClick?: (event: ThreeEvent<MouseEvent>) => void;
};

const MeshComponent = forwardRef<Mesh, Props>((props, ref) => {
  const { color, geometry, onDoubleClick } = props;

  return (
    <mesh ref={ref} onDoubleClick={onDoubleClick}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
});
export default MeshComponent;
