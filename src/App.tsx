import Canvas from './Components/CanvasComponent';
import ModuleRoutes from './Routing/ModuleRoutes';
import GeometryProvider from './Context/GeometryContext';

const App: React.FC = () => {

  return (
    <>
      <Canvas>
        <GeometryProvider>
          <ModuleRoutes />
        </GeometryProvider>
      </Canvas>
    </>
  )
}

export default App
