import React from "react";
import { GeometryContext } from "./GeometryContext";

export const useGeometry = () => {
  const context = React.useContext(GeometryContext);
  if(!context) throw new Error('useGeometryContext must be used within a GeometryProvider');
  return context;
};