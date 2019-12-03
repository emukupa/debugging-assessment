import React from "react";
import { Alert } from "antd";

export default ({ errors }) => {
  return (
    <div>
      {errors &&
        errors.length > 0 &&
        errors.map(error => (
          <Alert
            type="warning"
            style={{ marginBottom: "1em" }}
            message={error.msg}
          />
        ))}
    </div>
  );
};
