import React, { ReactNode  } from "react";
import { BufferGeometry } from "three";
import { Outlet } from 'react-router-dom';
import PlyLoader from '../Loaders/PlyLoader';

interface GeometryContextProps {
  geometry: BufferGeometry[],
  setGeometry: React.Dispatch<React.SetStateAction<BufferGeometry[]>>
}

export const GeometryContext = React.createContext<GeometryContextProps | null>(null);

interface GeometryProviderProps {
  children: ReactNode;
}

const GeometryProvider = ({children}: GeometryProviderProps) => {
  const [geometry, setGeometry] = React.useState<BufferGeometry[]>([]);
  React.useEffect(()=> {
    const initGeometry = async () => {
      const initData = await PlyLoader();
      setGeometry(initData);
    }
    initGeometry();
  }, []);
  const contextValue = {
    geometry,
    setGeometry
  };
  return(
    <GeometryContext.Provider value={contextValue} >
      {children}
      <Outlet />
    </GeometryContext.Provider>
  );
};

export default GeometryProvider;

