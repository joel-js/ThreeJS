import React from 'react';
import { Mesh } from 'three';
import { useGeometryContext } from '../Context/contextHooks';

type props = {
  color: number;
}

const MeshComponent = ({ color }: props) => {
  const ref = React.useRef<Mesh>(null);
  const { geometry } = useGeometryContext();
  console.log("geo: ",geometry);
  return(
    <mesh ref={ref}>
      <bufferGeometry attach="geometry" {...geometry[0]} />
      <meshBasicMaterial color = { color } wireframe /> 
    </mesh>
  )
};
export default MeshComponent;