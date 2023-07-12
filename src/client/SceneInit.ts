import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class SceneInit {
  private readonly _scene: THREE.Scene;
  private readonly _camera: THREE.PerspectiveCamera;
  private readonly _renderer: THREE.WebGLRenderer;
  private readonly _controller: OrbitControls;
  constructor() {
    this._scene =  new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
      );
      this._renderer = new THREE.WebGLRenderer();
      this._controller = new OrbitControls(this.camera, this.renderer.domElement);
  }

  public get scene(): THREE.Scene {
    return this._scene;
  }

  public get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  public get renderer(): THREE.WebGLRenderer{
    return this._renderer;
  }
  public get controller(): OrbitControls{
    return this._controller;
  }
  public render = () => {
    this._renderer.render(this._scene, this._camera);
  }

  private onWindowResize = () => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
  public initialize() {
    this.camera?.position.set(10, 10, 10);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    window.addEventListener("resize", this.onWindowResize, false);
  };
}