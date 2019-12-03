import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Menu, Dropdown, Icon } from "antd";
import jwt_decode from "jwt-decode";

const userMenu = (
  <Menu>
    <Menu.Item>
      <Link to="/logout">Sign Out</Link>
    </Menu.Item>
  </Menu>
);

class UserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userId: ""
    };
  }

  componentDidMount() {
    this.setUserInfoStateFromStoredToken();
  }

  setUserInfoStateFromStoredToken() {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwt_decode(token);
    this.setState({
      userName: decodedToken.userName,
      userId: decodedToken.userId
    });
  }

  render() {
    const { userName } = this.state;
    return (
      <div style={{ marginBottom: "1em" }}>
        <Row>
          <Col style={{ textAlign: "right" }} xs={24}>
            <Dropdown overlay={userMenu}>
              <span style={{ fontSize: "larger", color: "#aaa" }}>
                {userName} <Icon type="down" />
              </span>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserHeader;
