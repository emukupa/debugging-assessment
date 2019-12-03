import React from "react";
import { Redirect } from "react-router-dom";

export default () => {
  sessionStorage.clear();
  return <Redirect to="/login" />;
};
