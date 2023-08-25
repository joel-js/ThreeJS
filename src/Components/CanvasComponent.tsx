import { ReactNode } from 'react';
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Outlet } from 'react-router-dom';

interface CanvasComponentProps {
  children: ReactNode;
}

const CanvasComponent = ({ children }: CanvasComponentProps) => {
  return(
    <Canvas camera={{ position: [1, 1, 1] }} >
      {children}
      <Outlet />
      <OrbitControls dampingFactor={0.1}/>  
    </Canvas>
  );
};

export default CanvasComponent;