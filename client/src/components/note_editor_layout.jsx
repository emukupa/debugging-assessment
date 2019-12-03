import React from "react";

export default ({ children }) => (
  <div>
    <div
      style={{
        height: "40px",
        fontSize: "23px",
        fontWeight: "500",
        color: "#aaa"
      }}
    >
      {children}
    </div>
  </div>
);
