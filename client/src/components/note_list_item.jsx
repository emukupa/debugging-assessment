import React, { useState } from "react";
import { List, Row, Col, Icon } from "antd";
import moment from "moment";

export default ({ note, noteClicked }) => {
  const [hovered, setHovered] = useState(false);

  const sharedWithLabel = note => {
    if (note.sharedWith && note.sharedWith.length > 0) {
      const numberOfShared = note.sharedWith.length;
      if (numberOfShared > 1) {
        return `Shared with ${numberOfShared} Users`;
      }
      return `Shared with ${numberOfShared} User`;
    }
    return "";
  };

  return (
    <List.Item
      onClick={() => noteClicked(note._id)}
      style={{
        display: "block",
        backgroundColor: hovered ? "#efefef" : "white"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Row>
        <Col xs={22}>
          <Row>
            <Col xs={24}>
              <strong style={{ fontSize: "20px" }}>{note.title}</strong>
              <br />
              <span style={{ color: "#aaa" }}>
                Created <strong>{moment(note.createdAt).from()}</strong>
              </span>
              <span style={{ marginLeft: "2em" }}>
                <small>{sharedWithLabel(note)}</small>
              </span>
            </Col>
          </Row>
        </Col>
        <Col xs={2}>
          <Icon
            style={{
              textAlign: "right",
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
              marginTop: "3px"
            }}
            type="right"
          />
        </Col>
      </Row>
    </List.Item>
  );
};
