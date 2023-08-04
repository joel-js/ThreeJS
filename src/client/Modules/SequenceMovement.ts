import * as THREE from "three";
import * as _ from "lodash";
import SceneInit from "../SceneInit";
import DoublyLinkedList from "../Utils/DoublyLinkedList";
import { Payload, track, V3, WrapperType, AxisAngle } from "../Utils/types";
import Wrapper from "../Components/Wrapper";
import {
  _State,
  set_track,
  get_curr_index,
  set_curr_index,
  sequence,
  // _getter
} from "../StateManagement/SequentialManager";
import { _get } from "../StateManagement/SequentialManager";
import { GUIController } from "dat.gui";

const reverse_position_scale = (
  history: DoublyLinkedList<Payload>,
  wrapper: WrapperType,
  curr_state: _State,
  action: string
) => {
  let attribute: V3 | THREE.Euler | AxisAngle;
  switch (action) {
    case "position":
      attribute = new THREE.Vector3(0, 0, 0);
      break;
    case "scale":
      attribute = new THREE.Vector3(1, 1, 1);
      break;
    case "rotation":
      attribute = new THREE.Euler(0, 0, 0);
      break;
    case "rotateOnAxis":
      attribute = { axis: new THREE.Vector3(0, 0, 0), angle: 0 };
    default:
      attribute = new THREE.Vector3(0, 0, 0);
      break;
  }
  let flag = true;
  history.forEach((payload) => {
    if (payload.payload_id === curr_state.payload.payload_id) {
      flag = !flag;
      return;
    }
    if (flag && payload.action === curr_state.payload.action) {
      switch (action) {
        case "position":
          attribute = payload.position || attribute;
          break;
        case "scale":
          attribute = payload.scale || attribute;
          break;
        case "rotation":
          attribute = payload.rotation || attribute;
          break;
        case "rotateOnAxis":
          attribute = payload.rotateOnAxis || attribute;
          break;
      }
      // if (action === "position") attribute = payload.position || attribute;
      // else attribute = payload.scale || attribute;
    }
  });
  if (attribute instanceof THREE.Vector3) {
    if (action === "position") wrapper.position.copy(attribute);
    else wrapper.scale.copy(attribute);
  } else if (attribute instanceof THREE.Euler) {
    if (action === "rotation") wrapper.rotation.copy(attribute);
  } else if (
    typeof attribute === "object" &&
    "axis" in attribute &&
    "angle" in attribute
  ) {
    wrapper.rotateOnAxis(attribute["axis"], attribute["angle"]);
  }
};

export const navigateBack = (main: SceneInit) => {
  set_track(track.inactive);
  if (get_curr_index() < 0) {
    set_curr_index(sequence.length - 1);
  } else if (get_curr_index() > sequence.length - 1) {
    set_curr_index(0);
  }
  const curr_state = _get(get_curr_index());

  main.wrappers.forEach((wrapper) => {
    const history: DoublyLinkedList<Payload> = wrapper.componentHistory().delta;
    if (
      curr_state?.payload.action === "position" ||
      curr_state?.payload.action === "scale"
    ) {
      reverse_position_scale(
        history,
        wrapper,
        curr_state,
        curr_state?.payload.action
      );
    } else if (curr_state?.payload.action === "rotation") {
    } else if (curr_state?.payload.action === "rotateOnAxis") {
      reverse_position_scale(
        history,
        wrapper,
        curr_state,
        curr_state?.payload.action
      );
    }
  });
  set_curr_index(get_curr_index() - 1);
  set_track(track.active);
};

export const navigateForward = (main: SceneInit) => {
  set_track(track.inactive);
  if (get_curr_index() < 0) {
    set_curr_index(sequence.length - 1);
  } else if (get_curr_index() > sequence.length - 1) {
    set_curr_index(0);
  }
  set_curr_index(get_curr_index() + 1);
  console.log(get_curr_index());
  const curr_state = _get(get_curr_index());
  main.wrappers.forEach((wrapper) => {
    if (curr_state?.name === wrapper.name) {
      switch (curr_state.payload.action) {
        case "position":
          wrapper.position.copy(
            curr_state.payload.position || new THREE.Vector3(0, 0, 0)
          );
          break;
        case "scale":
          wrapper.scale.copy(
            curr_state.payload.scale || new THREE.Vector3(1, 1, 1)
          );
          break;
        case "rotation":
          wrapper.rotation.copy(
            curr_state.payload.rotation || new THREE.Euler(0, 0, 0)
          );
          break;
        case "rotateOnAxis":
          wrapper.rotateOnAxis(
            curr_state.payload.rotateOnAxis?.axis || new THREE.Vector3(1, 1, 1),
            curr_state.payload.rotateOnAxis?.angle || 0
          );
      }
    }
  });
  set_track(track.active);
};

// export const temp = () => {
//   const a = _getter(2);
//   if(a) a.payload.action = 'split'
// };

export const SequenceMovement = (main: SceneInit) => {
  let back: GUIController<Object>, forward: GUIController<Object>;
  const onBackClick = () => {
    if (sequence.length === 30 || get_curr_index() < 30) {
      console.log("back - disabled", sequence.length, get_curr_index());
    } else {
      console.log("back - enabled", sequence.length, get_curr_index());
      navigateBack(main);
    }
  };
  const onForwardClick = () => {
    if (sequence.length === 30 || get_curr_index() === sequence.length - 1) {
      console.log("forward - disabled", sequence.length, get_curr_index());
    } else {
      console.log("foeward - enabled", sequence.length, get_curr_index());

      navigateForward(main);
    }
  };
  const buttonFolder = main.gui.addFolder("Navigate");
  back = buttonFolder.add({ Back: onBackClick }, "Back").name("Back");
  forward = buttonFolder
    .add({ Forward: onForwardClick }, "Forward")
    .name("Forward");
  // const forwardParams = {
  //   forward: () =>navigateForward(main),
  //   isButtonDisabled: true
  // };
  // const backParams = {
  //   back: () =>navigateBack(main),
  //   isButtonDisabled: true
  // };
  // main.gui.add(forwardParams, 'forward');
  // main.gui.add(backParams, 'back');
  // const backButton = document.createElement('button');
  // backButton.textContent = 'Back';
  // backButton.style.marginRight = '5px';
  // backButton.disabled = true;
  // const forwardButton = document.createElement('button');
  // forwardButton.textContent = 'Forward';
  // forwardButton.disabled = true;
  // const updateButtons = () => {
  //   backButton.disabled = get_curr_index() <= 0 ;
  //   forwardButton.disabled = get_curr_index() >= sequence.length-1;
  // };
  // const init_sequences = () => {
  //   updateButtons();
  //   backButton.disabled = false;
  // }
  // backButton.addEventListener('click', () => {
  //   navigateBack(main);
  //   updateButtons();
  // });
  // forwardButton.addEventListener('click', () => {
  //   navigateForward(main);
  //   updateButtons();
  // });
  // main.gui.add({ 'Sequence Movements': init_sequences }, 'Sequence Movements')
};
