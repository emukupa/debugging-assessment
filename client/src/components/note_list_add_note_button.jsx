import React from "react";
import { Icon } from "antd";

export default ({ onClick }) => (
  <Icon
    style={{
      color: "#aaa",
      fontSize: "21px",
      float: "right",
      marginTop: "7px",
      marginRight: "7px"
    }}
    onClick={onClick}
    type="plus"
  />
);
