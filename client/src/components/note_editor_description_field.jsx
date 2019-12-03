import React from "react";
import { Card, Input } from "antd";

export default ({ value, onChange }) => (
  <Card
    bodyStyle={{
      height: "80vh",
      border: "1px solid #d9d9d9",
      padding: "1em"
    }}
  >
    <Input.TextArea
      style={{
        height: "100%",
        width: "100%",
        border: "none",
        fontSize: "18px",
        resize: "none"
      }}
      autosize={false}
      value={value}
      onChange={onChange}
    />
  </Card>
);
