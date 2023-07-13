import * as THREE from 'three';
import SceneInit from "./SceneInit";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";
import Attachments from './Modules/Attachments';
const App = (main: SceneInit) => {
  const mouseEvents = new MouseEvents(main);
  mouseEvents.highLight();
  const tm = new TeethMovements(main);
  tm.execute();
  const attachment = new Attachments(main);
  attachment.execute();
}
 
export default App;