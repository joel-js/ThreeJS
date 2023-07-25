import * as THREE from 'three';
import * as _ from 'lodash';
import * as dat from "dat.gui";

import SceneInit from "./SceneInit";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";
import CollisionMapping from './Modules/CollisionMapping';

import Transparency from './Modules/Transparency';
import Attachments from './Modules/Attachments';
const App = (main: SceneInit) => {
  Transparency(main);
  const mouseEvents = new MouseEvents(main);
  // mouseEvents.highLight();
  const tm = new TeethMovements(main);
  tm.execute();
  const attachments = new Attachments(main);
  attachments.execute();
  const colMap = new CollisionMapping(main);
  colMap.execute();

  const loadedScenes: any = [];
  let currentSceneIndex: number = 0;
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'sceneSlider';
  slider.min = '0';
  slider.max = '0';
  slider.step = '1';
  slider.value = '0';
  slider.style.width = '100%';

  const updateSlider = () => {
    const slider = document.getElementById('sceneSlider')as HTMLInputElement;
    slider.max = (loadedScenes.length - 1).toString();
    slider.value = slider.max;
  }

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.style.marginRight = '5px';
  backButton.disabled = true;

  const forwardButton = document.createElement('button');
  forwardButton.textContent = 'Forward';
  forwardButton.disabled = true;

  const updateButtons = () => {
    backButton.disabled = currentSceneIndex === 0;
    forwardButton.disabled = currentSceneIndex === loadedScenes.length - 1;
  };

  const saveScene = () => {
    console.log('main ',main);
    console.log('type ', main.toJSON());
    const sceneData = _.cloneDeep(main.scene.toJSON());
    sceneData['metadata'].name = sceneData['metadata'].name === undefined ? 0:  sceneData['metadata'].name++ ;
    console.log(sceneData['metadata'].name);
    loadedScenes.push(sceneData);
    // updateSlider();
    updateButtons();
  }
  const loadScene = () => {
    if (currentSceneIndex >= 0 && currentSceneIndex < loadedScenes.length) {
      main.scene.clear();
      const sceneData = loadedScenes[currentSceneIndex];
      main.scene = new THREE.ObjectLoader().parse(sceneData);
      main.scene.add(main.camera);
      main.renderer.render(main.scene, main.camera);
      console.log(main.scene);
      updateButtons();
    }
  }

  backButton.addEventListener('click', () => {
    currentSceneIndex -= 1;
    loadScene();
  });

  forwardButton.addEventListener('click', () => {
    currentSceneIndex += 1;
    loadScene();
  });

  // const sliderContainer = new dat.GUI().addFolder('Scene Slider');
  // sliderContainer.domElement.appendChild(slider);
  // slider.addEventListener('input', (event) => {
  //   const index = parseInt((event.target as HTMLInputElement)?.value, 10);
  //   if (!isNaN(index)) {
  //    loadScene(index);
  //   }
  // });

  const buttonContainer = new dat.GUI().addFolder('Scene Navigation');
  buttonContainer.domElement.appendChild(backButton);
  buttonContainer.domElement.appendChild(forwardButton);
  buttonContainer.open();

  main.gui.add({ 'Save Scene': saveScene }, 'Save Scene')
}

export default App;