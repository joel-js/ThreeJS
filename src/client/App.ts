import * as THREE from 'three';
import TransformControl from './Controls/TransformControl';
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';

const App = (main: SceneInit, {meshes, wrappers}: rt) => {
  const transformControl = TransformControl(main);
  const mouseEvents = new MouseEvents(main, { meshes, wrappers });
  mouseEvents.highLight();
}
 
export default App;