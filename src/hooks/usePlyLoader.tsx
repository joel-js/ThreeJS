import { useLoader } from "@react-three/fiber";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { BufferGeometry } from "three"; // Import BufferGeometry from three.js
// import React from 'react';

export const usePlyLoader = (modelPath: string): BufferGeometry => {
  const geometry: BufferGeometry = useLoader(PLYLoader, modelPath);
  return geometry;
};
