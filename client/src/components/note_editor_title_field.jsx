import React from "react";
import { Input } from "antd";

export default ({ value, onChange }) => (
  <Input
    style={{
      backgroundColor: "rgba(0,0,0,0)",
      border: "none",
      fontWeight: "500",
      color: "rgba(0,0,0,0.85)",
      fontSize: "21px"
    }}
    placeholder="New Note..."
    type="text"
    value={value}
    onChange={onChange}
  />
);
