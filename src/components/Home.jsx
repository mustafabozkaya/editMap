import React, { Component } from "react";
import Config from "../scripts/Config"; // import Config from "../scripts/Config";
import * as ROSLIB from "roslib"; // import roslib from "roslib";
import Connection from "./Connection"; // import components map , connection ...etc
import { Row, Col, Container } from "react-bootstrap"; // import feature from react bootstrap
import Map from "./Map";

class Home extends Component {
  state = {
    ros: null,
    connected: false,
  };
  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    // declare object from ROSLIB library called ros
    this.state.ros = new ROSLIB.Ros();

    // print it to console
    console.log(this.state.ros);
    // if it is connected it will print connection established in Teleoperation component! .
    // ros.on function is used to listen to the event of connection established
    // "connection" is the event name
    // this.connection is the function that will be called when the event is triggered

    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation component!");
      this.setState({ connected: true });
    });
    // if it is not connected it will print connection failed in Teleoperation component! .
    // ros.on function is used to listen to the event of connection failed
    // "error" is the event name
    this.state.ros.on("error", () => {
      console.log("connection failed in Teleoperation component!");
      this.setState({ connected: false });
      setInterval(() => {
        this.rosconnect("connection is error .reconnecting...");
      }, Config.RECONNECTION_TIMER);
    });
    // if it is not connected it will print connection is closed.
    // ros.on function is used to listen to the event of connection closed
    // "close" is the event name
    this.state.ros.on("close", () => {
      console.log("connection is closed");
      this.setState({ connected: false });
      // try to reconnect every 3 second
      {
        /*setTimeout is used to set a timer for a function to be called after a certain amount of time.*/
      }
      setInterval(() => {
        this.rosconnect();
      }, Config.RECONNECTION_TIMER);
      {
        /*setTimeout is used to set a timer for a function to be called after a certain amount of time. its difference from setInterval is that it will only be called once.*/
      }
      // setTimeout(() => {
      //   // Config is a js file include the constnt variables (like RECONNECTION_TIMER)that can reuse in different components
      // }, Config.RECONNECTION_TIMER);
    });
    this.rosconnect("connecting...");
  }

  rosconnect = (
    logmsg = "connection is closed .reconnecting...",
    errormsg = "connection problem"
  ) => {
    try {
      this.state.ros.connect(
        // local host
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log(logmsg);
      // to catch any errors specifically in this block we put it in catch and try block
    } catch (error) {
      console.log(" error : " + error);
      console.log(errormsg);
    }
  };

  render() {
    return (
      <div>
        <br></br>
        <Container>
          <h1 className="text-center" id="main_page">
            Robot Control Page
          </h1>
          <Row>
            <Col id="connection">
              <Connection ros={this.state.ros} />
            </Col>
          </Row>
          <Row>
            <Map ros={this.state.ros} float="left" />
            <Col></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
