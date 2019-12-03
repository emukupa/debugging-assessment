import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import Router from "./Router";

class App extends Component {
  constructor() {
    super();
    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  }

  render() {
    return <Router />;
  }
}

export default App;
