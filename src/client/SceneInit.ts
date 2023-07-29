import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshType, Mouse, WrapperType } from './Utils/types';
import { WrapperComponent } from "./Components/WrapperComponent";
import * as dat from "dat.gui";

export default class SceneInit {
  private  _scene: THREE.Scene;
  private readonly _camera: THREE.PerspectiveCamera;
  private readonly _renderer: THREE.WebGLRenderer;
  private readonly _controller: OrbitControls;
  private _meshes: Array<MeshType>;
  private _wrappers: Array<WrapperComponent>;
  // private _wrappers: Array<WrapperType>;
  private _raycaster: THREE.Raycaster;
  private _mouse: Mouse;
  private _ambientLight: THREE.AmbientLight;
  private _directionalLight: THREE.DirectionalLight;
  public gui: dat.GUI;

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
    this._meshes = [];
    this._wrappers = [];
    this._raycaster = new THREE.Raycaster();
    this._mouse = new THREE.Vector2();
    this.gui = new dat.GUI();
    this._ambientLight = new THREE.AmbientLight(0xffffff, 0);
    this._directionalLight = new THREE.DirectionalLight();  
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

  public get meshes(): Array<MeshType> {
    return this._meshes;
  }

  public get wrappers(): Array<WrapperComponent> {
  // public get wrappers(): Array<WrapperType> {
    return this._wrappers;
  }

  public get raycaster(): THREE.Raycaster {
    return this._raycaster;
  }

  public get mouse(): Mouse {
    return this._mouse;
  }
  
  public get directionalLight(): THREE.DirectionalLight {
    return this._directionalLight
  }

  public set meshes(meshes: Array<MeshType>) {
    this._meshes = meshes;
  }

  public set wrappers(wrappers: Array<WrapperComponent>) {
  // public set wrappers(wrappers: Array<WrapperType>) {
    this._wrappers = wrappers;
  }

  public set raycaster(raycaster: THREE.Raycaster) {
    this._raycaster = raycaster;
  }

  public set mouse(mouse: Mouse) {
    this._mouse = mouse;
  }

  public set scene(scene: THREE.Scene) {
    this._scene = scene;
  }
  public render = () => {
    this._renderer.render(this._scene, this._camera);
  }
  public updateLightWithCamera() {
    this._directionalLight.position.copy(this.camera.position);
    this._directionalLight.target.position.copy(
      this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1)
    );
  }

  private onWindowResize = () => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
  public initialize() {
    this.camera?.position.set(10, 10, 10);
    this._directionalLight.position.set(100, 100, 0);
    this.scene.add(this._ambientLight);
    this.scene.add(this._directionalLight);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setClearAlpha(0);
    document.body.appendChild(this._renderer.domElement);

    window.addEventListener("resize", this.onWindowResize, false);
  };

  public toJSON(): object {
    const serializedScene = {
      meshes: this._meshes.map(mesh => mesh.toJSON()),
      wrappers: this._wrappers.map(wrapper => wrapper.toJSON()),
      directionalLight: this._directionalLight.toJSON(),
    };
    return serializedScene;
  }
}