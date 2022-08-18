import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";

class Body extends Component {
  render() {
    return (
      <Container>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />}></Route>
          </Routes>
        </Router>
      </Container>
    );
  }
}

export default Body;
