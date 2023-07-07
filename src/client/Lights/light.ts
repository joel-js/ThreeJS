import * as THREE from 'three';

const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(100,100,0);



export  {ambientLight,directionalLight };
