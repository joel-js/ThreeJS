import * as THREE from 'three';

type state = {
  material: Function
}
type stateArray ={
  [key: string]: state
};
const curr_state: stateArray = { };

export const initial_State: stateArray = {
  'teeth': {
    material : () => new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    })
  },
  'gum': {
    material: () => new THREE.MeshLambertMaterial({
      color: 0xff8080,
      transparent: true,
      opacity: 1
    })
  }
};

export const getState = (key: string): stateArray[keyof state] => curr_state[key];

export const setState = (key: string, payload: state) => {
  curr_state[key] = payload;
}