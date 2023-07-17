import * as THREE from 'three';
import SceneInit from "../SceneInit";

const Transparency = (main: SceneInit) => {
  const gui = main.gui;
  const params = {
    transparency: 0
  };
  gui.add(params, 'transparency', 0,1,0.05,).onChange((val) => {
    main.meshes.forEach(mesh => {
      const material  = new THREE.MeshPhongMaterial({
        color: mesh.name === '_gum.ply' ? 0xff8080 : 0xffffff,
        transparent: true,
        opacity: 1-val
      });
      mesh.material =  material;
    })
    
  })
}
 
export default Transparency;