import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";

const App = (main: SceneInit, {meshes, wrappers}: rt) => {
  const mouseEvents = new MouseEvents(main, { meshes, wrappers });
  mouseEvents.highLight();
  const tm = new TeethMovements(main, {meshes, wrappers});
  tm.execute();
}
 
export default App;