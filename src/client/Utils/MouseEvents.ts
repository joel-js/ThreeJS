// type Mouse = THREE.Vector2 & {
//   x: number;
//   y: number;
// };
// const onMouseMove = (event: MouseEvent, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, sceneMeshes: THREE.Mesh[]) => {
//   const mouse: Mouse = new THREE.Vector2(); 
//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
//   raycaster.setFromCamera(mouse, camera);
//   raycaster.intersectObjects(sceneMeshes, false);
//   console.log(mouse);
// };