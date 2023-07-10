import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../../SceneInit";
import { rt, Mouse } from "../../Utils/types";

class CustomController {
  private main: SceneInit;
  private meshes: Array<THREE.Mesh>;
  private wrappers: Array<THREE.Group>;
  private raycaster: THREE.Raycaster;
  private mouse: Mouse;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  private otherControls: (OrbitControls | TransformControls)[];
  private keydownListener: ((event: KeyboardEvent) => void) | null;

  constructor(main: SceneInit, { meshes, wrappers }: rt, otherControls ?: (OrbitControls | TransformControls)[]) {
    this.main = main;
    this.meshes = meshes;
    this.wrappers = wrappers;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.intersectObject = null;
    this.otherControls = otherControls || [];
    this.keydownListener = null;

    this.teethFunctions = this.teethFunctions.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.moveTeeth = this.moveTeeth.bind(this);
    this.mesial = this.mesial.bind(this);
    this.distal = this.distal.bind(this);
  }

  private mesial(wrapper: THREE.Group) {
    console.log('here@mesial', wrapper.position);
    wrapper.position.add(
      wrapper
        .getWorldDirection(new THREE.Vector3(0, 0, 0))
        .multiplyScalar(10)
    );
    console.log('here@mesial2', wrapper.position);

  }
  private distal(wrapper: THREE.Group) {
    console.log('here@distal', wrapper.position);
    wrapper.position.add(
      wrapper
        .getWorldDirection(new THREE.Vector3(1, 1, 1))
        .multiplyScalar(-10)
    );
    console.log('here@distal2', wrapper.position);
  }

  private moveTeeth(wrapper: THREE.Group) {
    if (this.keydownListener) {
      // Remove the previous keydown event listener
      window.removeEventListener("keydown", this.keydownListener);
    }

    this.keydownListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          this.mesial(wrapper);
          break;
        case "ArrowDown":
          this.distal(wrapper);
          break;
      }
    };
    window.addEventListener("keydown", this.keydownListener);
  }

  private onMouseDoubleClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.main.camera);

    this.intersects = this.raycaster.intersectObjects(this.wrappers, true);

    if (this.intersects.length > 0) {
      this.intersectObject = this.intersects[0].object;
    } else {
      this.intersectObject = null;
    }
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];
      const wrapper = this.wrappers[i];
      if (this.intersectObject && this.intersectObject.name === mesh.name) {
        console.log('@dbl', wrapper);
        this.moveTeeth(wrapper);
        
        break;
      }
    }
  }
  public teethFunctions() {
    this.main.renderer.domElement.addEventListener(
      "dblclick",
      this.onMouseDoubleClick,
      false
    );
    // window.addEventListener(
    //   "keydown",
    //   (event) => {
    //     switch (event.key) {
    //       case "w":
    //         console.log('moveTeethup');
            
    //         break;
    //       case "s":
    //         console.log('moveTeethdown');
    //         // this.distal();
    //         break;
    //     }
    //   }
    // );
  }
}
export default CustomController;

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls";
// import SceneInit from "../../SceneInit";
// import { rt, Mouse } from "../../Utils/types";

// class CustomController {
//   private main: SceneInit;
//   private meshes: Array<THREE.Mesh>;
//   private wrappers: Array<THREE.Group>;
//   private raycaster: THREE.Raycaster;
//   private mouse: Mouse;
//   private intersects: THREE.Intersection[];
//   private intersectObject: THREE.Object3D | null;
//   private otherControls: (OrbitControls | TransformControls)[];

//   constructor(main: SceneInit, { meshes, wrappers }: rt, otherControls ?: (OrbitControls | TransformControls)[]) {
//     this.main = main;
//     this.meshes = meshes;
//     this.wrappers = wrappers;
//     this.raycaster = new THREE.Raycaster();
//     this.mouse = new THREE.Vector2();
//     this.intersects = [];
//     this.intersectObject = null;
//     this.otherControls = otherControls || [];
//     this.teethFunctions = this.teethFunctions.bind(this);
//     this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
//     this.moveTeeth = this.moveTeeth.bind(this);
//     this.mesial = this.mesial.bind(this);
//     this.distal = this.distal.bind(this);

//     this.attachKeyDownListener(); // Attach the keydown event listener once during initialization
//   }

//   private mesial(wrapper: THREE.Group) {
//     console.log('here@mesial');
//     wrapper.position.add(
//       wrapper
//         .getWorldDirection(new THREE.Vector3(10, 5, 7.5))
//         .multiplyScalar(10)
//     );
//   }
  
//   private distal(wrapper: THREE.Group) {
//     console.log('here@distal');
//     wrapper.position.add(
//       wrapper
//         .getWorldDirection(new THREE.Vector3(-10, -5, -7.5))
//         .multiplyScalar(10)
//     );
//   }

//   private moveTeeth(event: KeyboardEvent, wrapper: THREE.Group) {
//     switch (event.key) {
//       case "ArrowUp":
//         this.mesial(wrapper);
//         break;
//       case "ArrowDown":
//         this.distal(wrapper);
//         break;
//     }
//   }

//   private attachKeyDownListener() {
//     console.log('keydown');
//     this.main.renderer.domElement.addEventListener(
//       "keydown",
//       (event: KeyboardEvent) => {
//         // Call moveTeeth for the selected wrapper
//         for (let i = 0; i < this.meshes.length; i++) {
//           const mesh = this.meshes[i];
//           const wrapper = this.wrappers[i];
//           if (
//             this.intersectObject &&
//             this.intersectObject.name === mesh.name
//           ) {
//             this.moveTeeth(event, wrapper);
//             break;
//           }
//         }
//       }
//     );
//   }

//   private onMouseDoubleClick(event: MouseEvent): void {
//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     this.raycaster.setFromCamera(this.mouse, this.main.camera);

//     this.intersects = this.raycaster.intersectObjects(this.wrappers, true);

//     if (this.intersects.length > 0) {
//       this.intersectObject = this.intersects[0].object;
//     } else {
//       this.intersectObject = null;
//     }
//   }

//   public teethFunctions() {
//     this.main.renderer.domElement.addEventListener(
//       "dblclick",
//       this.onMouseDoubleClick,
//       false
//     );
//   }
// }

// export default CustomController;

