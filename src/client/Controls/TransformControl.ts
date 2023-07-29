import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { MeshType, Mode, WrapperType } from '../Utils/types';

const TransformControl = (client: SceneInit, attachment: (WrapperType | MeshType), callBack?: Function,otherControls?: (OrbitControls | TransformControls)[], defaultMode?: Mode, restrictModes ?: Array<Mode>): TransformControls => {
  
  const control = new TransformControls(client.camera, client.renderer.domElement);
  const restrict= {
    [Mode.Translate]: false,
    [Mode.Rotate]: false,
    [Mode.Scale]: false
  };
  if(restrictModes?.length) {
    restrictModes.forEach(mode => restrict[mode] = true) 
  }
  if ( restrictModes && defaultMode && restrictModes.includes(defaultMode)) {
    throw new Error(`The mode ${defaultMode} is restricted.`);
  } else {
    control.setMode(defaultMode || Mode.Translate); // find it here
  }

  client.scene.add(control);
  control.attach(attachment);

  control.addEventListener("dragging-changed", function (event) {
    client.controller.enabled = !event.value;
    if (otherControls)
      otherControls.forEach(controller => {
        controller.enabled = !event.value;
      });
    if (callBack) callBack(attachment, control.getMode());
  });
  
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "g":
        !restrict[Mode.Translate] && control.setMode(Mode.Translate);
        break;
      case "r":
        !restrict[Mode.Rotate] && control.setMode(Mode.Rotate);
        break;
      case "s":  
      !restrict[Mode.Scale] && control.setMode(Mode.Scale);
        break;
    }
  });
  return control;
};
export default TransformControl; 

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls";
// import SceneInit from "../SceneInit";
// import { Mesh, Mode, Wrapper } from '../Utils/types';

// class ReadOnlyProperty {
//   private _value: Mode | Mode[]|undefined;

//   constructor(value?: Mode) {
//     this._value = value;
//   }

//   set(value: Mode) {
//     if (this._value !== undefined) {
//       throw new Error('Readonly property cannot be set directly.');
//     } 
//     this._value = value;
//   }

//   toString(): Mode | Mode[] |undefined {
//     return this._value;
//   }
// }

// export default class TransformControl {
//   private control: TransformControls;
//   defaultMode: { readonly value: Mode | undefined, set: (value: Mode) => void };
//   otherControls: { readonly value: any, set: (value: any) => void };
//   restrictModes: { readonly value: any, set: (value: Mode) => void };
//   restrict: {
//     [Mode.Translate]: boolean,
//     [Mode.Rotate]: boolean,
//     [Mode.Scale]: boolean
//   } = {
//     [Mode.Translate]: false,
//     [Mode.Rotate]: false,
//     [Mode.Scale]: false
//   };

//   constructor(client: SceneInit, attachment: (Wrapper | Mesh)) {
//     this.control = this.createControl(client, attachment);
//     this.defaultMode = this.createReadOnlyProperty();
//     this.otherControls = this.createReadOnlyProperty();
//     this.restrictModes = this.createReadOnlyProperty();

//     this.addEventListeners(client);
//   }

//   private createControl(client: SceneInit, attachment: (Wrapper | Mesh)): TransformControls {
//     const control = new TransformControls(client.camera, client.renderer.domElement);
//     client.scene.add(control);
//     control.attach(attachment);

//     return control;
//   }
  
//   private validateRestrictedModes(value: Mode) {
//     if (this.restrictModes.value) {
//       console.log('here');
//       const allModes = [Mode.Translate, Mode.Rotate, Mode.Scale];
//       const nonRestrictedModes = allModes.filter(mode => !this.restrictModes.value.includes(mode));

//       if (nonRestrictedModes.length === 0) {
//         throw new Error('All modes are restricted.');
//       }

//       if (!this.defaultMode.value && nonRestrictedModes.includes(value)) {
//         this.defaultMode.set(value);
//       } else if (this.defaultMode.value === value) {
//         throw new Error(`The mode ${value} is restricted.`);
//       }
//     }
//     else {
//       console.log('Nice');
//       if (this.defaultMode.value){
//         this.control.setMode(this.defaultMode.value);
//       }
//       else{
//         this.control.setMode(Mode.Translate);
//       }
//     }
//   }

//   private createReadOnlyProperty() {
//     const readOnlyProperty = new ReadOnlyProperty();
//     return {
//       value: readOnlyProperty.toString(),
//       set: (value: Mode) => {
//         this.validateRestrictedModes(value);
//         readOnlyProperty.set(value);
//       },
//     };
//   }

//   private addEventListeners(client: SceneInit) {
//     this.control.addEventListener("dragging-changed", (event) => {
//       client.controller.enabled = !event.value;
//       if (this.otherControls.value) {
//         this.otherControls.value.forEach((controller: OrbitControls | TransformControls) => {
//           controller.enabled = !event.value;
//         });
//       }
//     });

//     window.addEventListener("keydown", (event) => {
//       switch (event.key) {
//         case "g":
//           !this.restrict[Mode.Translate] && this.control.setMode(Mode.Translate);
//           break;
//         case "r":
//           !this.restrict[Mode.Rotate] && this.control.setMode(Mode.Rotate);
//           break;
//         case "s":
//           !this.restrict[Mode.Scale] && this.control.setMode(Mode.Scale);
//           break;
//       }
//     });
//   }

// }
