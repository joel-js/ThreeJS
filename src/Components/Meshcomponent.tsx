import React from 'react';
import { Mesh } from 'three';
import { BufferGeometry } from "three";

type props = {
  color: number;
  geometry: BufferGeometry
}

const MeshComponent = ({ color, geometry }: props) => {
  const ref = React.useRef<Mesh>(null);
  // console.log(geometry);
  return(
    <mesh ref={ref} >
      <bufferGeometry attach="geometry" {...geometry} />
      {/* <torusKnotGeometry /> */}
      <meshLambertMaterial color = { color } /> 
    </mesh>
  )
};
export default MeshComponent;