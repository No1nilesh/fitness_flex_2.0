import React from "react";

const ControlButtons = ({ handleClick, icon }) => {
  return (
    <div
      className="bg-secondary-foreground rounded-full px-4 md:px-3 size-12  flex-center drop-shadow-md cursor-pointer"
      onClick={handleClick}
    >
      {icon}
    </div>
  );
};

export default ControlButtons;
