import React, { Component } from "react";
import Config from "../scripts/Config"; // import Config from "../scripts/Config";
import * as ROSLIB from "roslib"; // import roslib from "roslib";
import Connection from "./Connection"; // import components map , connection ...etc
import { Row, Col, Container } from "react-bootstrap"; // import feature from react bootstrap
import Map from "./Map";

class Home extends Component {
 
  state = {
    ros: null,
  };
  constructor() {
    super();
    this.init_connection();
  }
  init_connection() {
    // declare object from ROSLIB library caalled ros
    this.state.ros = new ROSLIB.Ros();
    // print it to console
    console.log(this.state.ros);
    // if it is connected it will print connection established in Teleoperation component! .
    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation component!");
      this.setState({ connected: true });
    });
    // if it is not connected it will print connection is closed.
    this.state.ros.on("close", () => {
      console.log("connection is closed");
      this.setState({ connected: false });
      // try to reconnect every 3 second
      setTimeout(() => {
        try {
          this.state.ros.connect(
            // local host
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
          // to catch any errors specifically in this block we put it in catch and try block
        } catch (error) {
          console.log("connection problem");
        }
        // Config is a js file include the constnt variables (like RECONNECTION_TIMER)that can reuse in different components
      }, Config.RECONNECTION_TIMER);
    });
    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("connection problem");
    }
  }

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
            <Map ros={this.state.ros} float="left"/>
            <Col></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
