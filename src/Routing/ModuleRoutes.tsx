import { Routes, Route } from 'react-router-dom';
import Home from '../Modules/Home/Home';
import CollisionMapping from '../Modules/CollisionMapping/CollisionMapping';
import Symmetry from '../Modules/Symmetry/Symmetry';

const ModuleRoutes: React.FC = () => {
  return(
    <Routes>
          <Route path="/home" element={ <Home/> } />
          <Route path="/collision" element={ <CollisionMapping/> } />
          <Route path="/symmetry" element={ <Symmetry/>}/>
    </Routes>
  );
}
export default ModuleRoutes;
