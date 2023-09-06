import React from "react";

interface ButtonProps {
  onClick: () => void;
  btnName: string;
}

const MenuBarButton: React.FC<ButtonProps> = ({ btnName, onClick }) => {
  return (
    <div>
      <button className="side-bar-button" onClick={onClick} >
        {btnName}
      </button>
    </div>
  );
};

export default MenuBarButton;
