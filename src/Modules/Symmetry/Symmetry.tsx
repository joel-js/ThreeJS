import React from "react";
import { BufferGeometry } from "three";
import Mesh from "../../Components/Meshcomponent";
import { useGeometry } from "../../Context/contextHooks";

const Symmetry: React.FC = () => {
  const { geometry } = useGeometry();
  const clickHandler = () => {
    console.log("it works");
  };

  return (
    <React.Fragment>
      {geometry &&
        geometry.map((g: BufferGeometry, i: number) => {
          return (
            <Mesh
              key={i}
              color={i === 0 ? 0xff8080 : 0xffffff}
              geometry={g}
              onDoubleClick={clickHandler}
            />
          );
        })}
    </React.Fragment>
  );
};

export default Symmetry;
