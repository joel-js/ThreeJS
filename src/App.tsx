


import { Canvas } from "@react-three/fiber";
import { usePlyLoader } from "./hooks/usePlyLoader";
import { OrbitControls } from '@react-three/drei';

const {spawn} = await import("child_process");


const App = () => {
  const geometry = usePlyLoader("models/_gum.ply");


const pythonProcess = spawn('python', ['./test.py']);
pythonProcess.stdout.on('data', (data) => {
  console.log("data");
  
  console.log(`Python Output: ${data}`);
});

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ fov: 75, position: [-10, 45, 20] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh geometry={geometry}>
        <meshBasicMaterial color={0xff8080} />
        </mesh> 
        <OrbitControls dampingFactor={1}/>
      </Canvas>
    </div>
  );
};

export default App;
