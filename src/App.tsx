import { Canvas } from "@react-three/fiber";
import { usePlyLoader } from "./hooks/usePlyLoader";
import { OrbitControls } from '@react-three/drei';


const App = () => {
  // const handleShowLoading = () => {
  //   window.loadingUtils.appendLoading();
  // };

  // const handleHideLoading = () => {
  //   window.loadingUtils.removeLoading();
  // };
  const geometry = usePlyLoader("models/_gum.ply");
  const handleButtonClick = () => {
    window.electron.send('run-python-script');
  };
  return (
    <>
      <div style={{ width: "100vw", height: "30vh" }}>
      <button onClick={handleButtonClick}>Run Python Script</button>
      </div>
      <div style={{ width: "100vw", height: "70vh" }}>
        <Canvas camera={{ fov: 75, position: [-10, 45, 20] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh geometry={geometry}>
          <meshBasicMaterial color={0xff8080} />
          </mesh> 
          <OrbitControls dampingFactor={1}/>
        </Canvas>
      </div>
    </>
  );
};

export default App;
