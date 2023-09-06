import React from 'react';
import { BufferGeometry } from 'three';
import Mesh from '../../Components/Meshcomponent';
import { useGeometry } from "../../Context/contextHooks";

const CollisionMapping: React.FC = () => {
  const { geometry } = useGeometry();

  return (
    <React.Fragment>
      {geometry &&
        geometry.map((g: BufferGeometry, i: number) => {
          return <Mesh key={i} color={0xff0000} geometry={g} />;
        })}
    </React.Fragment>
  )
};

export default CollisionMapping;
