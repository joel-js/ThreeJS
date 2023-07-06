import * as THREE from 'three';
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";



const plyLoader = (file: string, mesh: THREE.Mesh, wrapper: THREE.Group) => {
  const loader: PLYLoader = new PLYLoader();
  const onLoad = (geometry: THREE.BufferGeometry): void => {
    mesh.geometry = geometry;
    mesh.name = 'sync'
    wrapper.add(mesh);
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = boundingBox.getCenter(new THREE.Vector3());  
    wrapper.position.set(center.x, center.y, center.z);
    mesh.position.set(-center.x, -center.y, -center.z);
  };
  const progress = (xhr: ProgressEvent): void => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };
  const error = (error: ErrorEvent): void => {
    console.log(error);
  };
  loader.load(file, onLoad, progress, error);
};

export default plyLoader;