import React from "react";
import { BufferGeometry } from 'three';
import Mesh from "../../Components/Meshcomponent";
import { useGeometry } from "../../Context/contextHooks";

const Home: React.FC = () => {
  const { geometry } = useGeometry();
  return (
    <React.Fragment>
      {geometry &&
        geometry.map((g: BufferGeometry, i: number) => {
          return <Mesh key={i} color={i === 0 ? 0xff8080 : 0xffffff} geometry={g} />;
        })}
    </React.Fragment>
  );
};

export default Home;
