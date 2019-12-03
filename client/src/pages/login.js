import React, { useState } from "react";
import { Layout, Form, Icon, Input, Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorDisplay from "../components/error_display";
const { Content } = Layout;

export default ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    signInUser(email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    axios
      .post("/users/signin", {
        email,
        password
      })
      .then(response => {
        setLoading(false);
        if (response.status === 200) {
          const newToken = response.data.token;
          if (newToken) {
            sessionStorage.setItem("token", newToken);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            history.push("/notes");
          }
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
          <h1 style={{ fontWeight: "800" }}>Login</h1>
          <ErrorDisplay errors={errors} />
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                size="large"
                disabled={loading}
                placeholder="E-Mail"
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
              <Button
                loading={loading}
                type="primary"
                size="large"
                block
                htmlType="submit"
              >
                Log in
              </Button>
              Or <Link to="/register">register now!</Link>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};
