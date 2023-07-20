import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
const TransformControl = (client: SceneInit, otherControls?: (OrbitControls | TransformControls)[]): TransformControls => {
  
  const transformControls = new TransformControls(client.camera, client.renderer.domElement);
  transformControls.setMode("translate");
  client.scene.add(transformControls);
  transformControls.addEventListener("dragging-changed", function (event) {
    client.controller.enabled = !event.value;
    if (otherControls)
      otherControls.forEach(controller => {
        controller.enabled = !event.value;
      });
  });
  
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "g":
        transformControls.setMode("translate");
        break;
        }
  });
  return transformControls;
};
export default TransformControl; 