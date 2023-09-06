import React from "react";
import MenuBarButton from "./MenuBarButton";
import { actionButtons } from "./constants";

interface FunctionMappings {
  [key: string]: () => void;
}

const MenuBar: React.FC = () => {

  const functionMappings: FunctionMappings = {
    moveTeeth: () => {
      
    },
    collisionDetection: () => {
      console.log("Collision detection clicked");
    },
    // Add more function mappings here for other buttons
  };
  return (
    <div className="sidebar-menu-container">
      {actionButtons.map((button) => {
        return (
          <MenuBarButton
            key={button.id}
            btnName={button.btnName}
            onClick={functionMappings[button.id]}
          />
        );
      })}
    </div>
  );
};

export default MenuBar;
