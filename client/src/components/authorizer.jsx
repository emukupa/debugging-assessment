import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Authorizer extends Component {
  constructor(props) {
    super(props);
    this.setupAxiosErrorHandlers();
    this.setupAxiosDefaultHeaders();
  }

  setupAxiosDefaultHeaders() {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  setupAxiosErrorHandlers() {
    axios.interceptors.response.use(
      response => response,
      this.axiosUnauthorizedHandler
    );
  }

  axiosUnauthorizedHandler(error) {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default Authorizer;
