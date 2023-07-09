import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';

const App = (main: SceneInit, {meshes, wrappers}: rt) => {
  const mouseEvents = new MouseEvents(main, { meshes, wrappers });
  mouseEvents.highLight();
  mouseEvents.selectWrapper();
}
 
export default App;