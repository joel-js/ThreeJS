import { Routes, Route } from 'react-router-dom';
import Home from '../Modules/Home/Home';
import CollisionMapping from '../Modules/CollisionMapping/CollisionMapping';

const ModuleRoutes: React.FC = () => {
  return(
    <Routes>
          <Route path="/home" element={ <Home/> } />
          <Route path="/collision" element={ <CollisionMapping/> } />
    </Routes>
  );
}
export default ModuleRoutes;
