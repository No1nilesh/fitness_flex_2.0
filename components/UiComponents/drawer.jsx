"use client";

import { cn } from "@lib/utils";
import React from "react";

const Drawer = ({ open, className, width, drawerOptions, activeOption }) => {
  const renderDrawerContent = () => {
    const activeComponent = drawerOptions.find(
      (option) => option.name === activeOption
    )?.component;
    return activeComponent ? React.createElement(activeComponent) : <div></div>;
  };

  return (
    <div
      className={cn(
        `transition-all ease-in-out duration-300 origin-right ${
          open ? `${width} opacity-100` : "w-0 opacity-0"
        }`,
        className
      )}
    >
      {/* {children} */}
      {renderDrawerContent()}
    </div>
  );
};

export default Drawer;
