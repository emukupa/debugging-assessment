import React from "react";
import NoteListItem from "./note_list_item";
import { List } from "antd";

export default ({ notes, loading, noteClicked }) => (
  <div>
    <List
      size="large"
      loading={loading}
      style={{ backgroundColor: "white" }}
      bordered
      dataSource={notes}
      renderItem={note => (
        <NoteListItem noteClicked={noteClicked} note={note} />
      )}
    />
  </div>
);
