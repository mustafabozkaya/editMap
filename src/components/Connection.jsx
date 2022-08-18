import React from "react";
import Alert from "react-bootstrap/Alert";
// import Config from "../scripts/Config";
// import * as ROSLIB from "roslib";

const Connection = (props) => {
  const ros = props.ros;
  return (
    <div>
      <Alert // render alert message to know if the ros connected or not
        className="text-center"
        // the next syntex is an if statment
        variant={ros.isConnected ? "success" : "danger"}
      >
        {ros.isConnected ? "Robot Connected" : "Robot Disconnected"}
      </Alert>
    </div>
  );
};

export default Connection;
