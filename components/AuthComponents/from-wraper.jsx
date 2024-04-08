import React from "react";

const FromWrapper = ({ children, header }) => {
  return (
    <div>
      <div className="small_head_text  text-center">{header}</div>
      {children}
    </div>
  );
};

export default FromWrapper;
