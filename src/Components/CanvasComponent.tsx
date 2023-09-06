import { ReactNode } from 'react';
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Outlet } from 'react-router-dom';

import { DirectionalLightFollowingCamera } from './Lights';

interface CanvasComponentProps {
  children: ReactNode;
}

const CanvasComponent = ({ children }: CanvasComponentProps) => {
  return(
    <Canvas camera={{ position: [15, 15, 15] }} >
      {children}
      <Outlet />
      <OrbitControls dampingFactor={0.1}/>  
      <DirectionalLightFollowingCamera />
    </Canvas>
  );
};

export default CanvasComponent;