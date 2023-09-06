import React from "react";
import MenuBarButton from "./MenuBarButton";
import { actionButtons } from "./constants";
import { useNavigate } from "react-router-dom";

interface FunctionMappings {
  [key: string]: () => void;
}

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const functionMappings: FunctionMappings = {
    moveTeeth: () => navigate("/home"),
    collisionDetection: () => navigate("/collision")
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
