import { BufferGeometry } from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { FILENAMES } from '../Utils/Constants';

const  PlyLoader = async () => {
  const loader  = new PLYLoader();
  const loadedGeometries: BufferGeometry[] = await Promise.all(
    FILENAMES.map(async (filepath) => {
      const geometry = await loader.loadAsync(filepath);
      geometry?.computeVertexNormals();
      geometry.name = filepath;
      return geometry;
    })
  );
  return loadedGeometries;
};

export default PlyLoader;
