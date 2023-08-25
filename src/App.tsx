import React from 'react';
import Canvas from './Components/CanvasComponent';
import ModuleRoutes from './Routing/ModuleRoutes';
import GeometryProvider from './Context/GeometryContext';
// import PlyLoader from './Loaders/PlyLoader';
// import { useGeometryContext } from './Context/contextHooks';
// import { BufferGeometry } from 'three';

const App: React.FC = () => {

  return (
    <React.Fragment>
      {/* {geometry.length && 'hello'} */}
      <Canvas>
        <GeometryProvider>
          <ModuleRoutes />
        </GeometryProvider>
      </Canvas>
    </React.Fragment>
  )
}

export default App
