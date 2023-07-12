import * as THREE from 'three';
import SceneInit from "./SceneInit";
// import { GUI } from 'dat.gui';
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";
import Attachments from './Modules/Attachments';

const App = (main: SceneInit, {meshes, wrappers}: rt) => {
  const mouseEvents = new MouseEvents(main, { meshes, wrappers });
  mouseEvents.highLight();
  const tm = new TeethMovements(main, {meshes, wrappers});
  tm.execute();
  const attachments = new Attachments(main, {meshes, wrappers});
  // attachments.execute();
}
 
export default App;