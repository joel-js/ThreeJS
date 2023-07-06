import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
const TransformControl = (client: SceneInit, otherControls: (OrbitControls | TransformControls)[]): TransformControls => {
  
  const transformControls = new TransformControls(client.camera, client.renderer.domElement);
  transformControls.setMode("rotate");
  client.scene.add(transformControls);
  transformControls.addEventListener("dragging-changed", function (event) {
    otherControls.forEach(controller => {
      controller.enabled = !event.value;
    });
  });
  
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "g":
        transformControls.setMode("translate");
        break;
      case "r":
        transformControls.setMode("rotate");
        break;
      case "s":
          transformControls.setMode("scale");
          break;
        }
  });
  return transformControls;
};
export default TransformControl; 