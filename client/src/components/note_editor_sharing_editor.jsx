import React, { useState } from "react";
import axios from "axios";
import ErrorDisplay from "./error_display";
import { Icon, Modal, Input, Button } from "antd";

export default ({ note }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const saveClicked = () => {
    // Save the note
    shareNote();
  };

  const cancelClicked = () => {
    setModalOpen(false);
  };

  const shareNote = () => {
    setLoading(true);
    axios
      .post("/notes/" + note._id + "/share?email=" + email)
      .then(response => {
        setLoading(false);
        setModalOpen(false);
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
    <div>
      <Icon
        style={{
          float: "right",
          paddingTop: "0.2em"
        }}
        type="usergroup-add"
        onClick={() => setModalOpen(true)}
      />
      <Modal
        title="Share Note"
        visible={modalOpen}
        onOk={saveClicked}
        onCancel={cancelClicked}
        footer={[
          <Button key="back" onClick={() => cancelClicked()}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => saveClicked()}
          >
            Submit
          </Button>
        ]}
      >
        <ErrorDisplay errors={errors} />
        <Input
          type="text"
          value={email}
          placeholder="person@example.com"
          onChange={event => setEmail(event.target.value)}
        />
      </Modal>
    </div>
  );
};
