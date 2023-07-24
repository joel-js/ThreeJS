import * as _ from "lodash";
import { state, stateArray } from "../Utils/types";

const curr_state: stateArray = {};

export const initial_State: stateArray = {
  teeth: {
    material: {
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    },
  },
  gum: {
    material: {
      color: 0xff8080,
      transparent: true,
      opacity: 1,
    },
  },
};

/** gets the current state */
export const getState = (key: string): stateArray[keyof state] =>
  _.cloneDeep(curr_state[key]);

/** overrides current state and sets a new state altogether*/
export const setState = (key: string, payload: state) => {
  curr_state[key] = payload;
};

/** updates existing (key,vlaue) pair, only if it already exist in the state */
export const updateState = (key: string, payload: state) => {
  const getCurrState = getState(key);
  const newState = _.merge(getCurrState, payload);
  curr_state[key] = newState;
};
