import Canvas from './Components/CanvasComponent';
import ModuleRoutes from './Routing/ModuleRoutes';
import GeometryProvider from './Context/GeometryContext';
import MenuBar from './Components/MenuBar/MenuBar';
import './App.css'

const App: React.FC = () => {

  return (
    <>
      <Canvas >
        <GeometryProvider>
          <ModuleRoutes />
        </GeometryProvider>
      </Canvas>
      <MenuBar/>
    </>
  )
}

export default App
