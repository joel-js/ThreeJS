import * as THREE from 'three';
import SceneInit from "./SceneInit";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";
import Transparency from './Modules/Transparency';
const App = (main: SceneInit) => {
  Transparency(main);
  const mouseEvents = new MouseEvents(main);
  mouseEvents.highLight();
  const tm = new TeethMovements(main);
  tm.execute();
}
 
export default App;