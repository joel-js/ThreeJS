import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { rt } from "./Utils/types";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";

const App = (main: SceneInit) => {
  const mouseEvents = new MouseEvents(main);
  mouseEvents.highLight();
  const tm = new TeethMovements(main);
  tm.execute();
}
 
export default App;