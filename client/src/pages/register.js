import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Form, Icon, Input, Button } from "antd";
import axios from "axios";
import ErrorDisplay from "../components/error_display";
const { Content } = Layout;

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    if (confirmPassword === password) {
      registerUser(fullName, email, password);
    } else {
      setErrors([{ msg: "Password must match!" }]);
    }
  };

  const registerUser = (fullName, email, password) => {
    setLoading(true);
    axios
      .post("/users/register", {
        name: fullName,
        email,
        password
      })
      .then(response => {
        setLoading(false);
        if (response.status === 201) {
          // User Created, redirect to homepage
          window.location.href = "/login";
        }
      })
      .catch(error => {
        setLoading(false);
        const { response } = error;
        if (response && response.data && response.data.errors) {
          setErrors(response.data.errors);
        } else {
          setErrors(["Oops. Something went wrong on our end."]);
        }
      });
  };

  return (
    <Layout style={{ backgroundColor: "#ECECEC", height: "100vh" }}>
      <Content style={{ padding: "5em" }}>
        <div
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            width: 250
          }}
        >
          <h1 style={{ fontWeight: "800" }}>Register</h1>
          <ErrorDisplay errors={errors} />
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                placeholder="Full Name"
                disabled={loading}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                placeholder="E-Mail"
                disabled={loading}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                type="password"
                placeholder="Password"
                disabled={loading}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                type="password"
                placeholder="Confirm Password"
                disabled={loading}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                loading={loading}
                block
                htmlType="submit"
              >
                Register
              </Button>
              Already have an account? <Link to="/login">Login Now</Link>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};
