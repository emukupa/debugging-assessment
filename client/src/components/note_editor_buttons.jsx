import React from "react";
import { Icon, Tooltip } from "antd";

export default ({ saveClicked, deleteClicked, restoreClicked, isRecycled }) => (
  <div>
    {isRecycled && (
      <Tooltip title="Restore Note">
        <Icon
          style={{
            float: "right",
            paddingTop: "0.2em",
            marginRight: "0.5em"
          }}
          type="rollback"
          onClick={() => restoreClicked()}
        />
      </Tooltip>
    )}
    {!isRecycled && (
      <Tooltip title="Delete Note">
        <Icon
          style={{
            float: "right",
            paddingTop: "0.2em",
            marginRight: "0.5em"
          }}
          type="delete"
          onClick={() => deleteClicked()}
        />
      </Tooltip>
    )}
    {!isRecycled && (
      <Tooltip title="Save Note">
        <Icon
          key={1}
          style={{
            float: "right",
            paddingTop: "0.2em",
            marginRight: "0.5em"
          }}
          onClick={() => saveClicked()}
          type="save"
        />
      </Tooltip>
    )}
  </div>
);
