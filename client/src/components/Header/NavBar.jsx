import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar2 from "react-bootstrap/Navbar";
import "./NavBar.css";
import logoImage from "../../assets/img/logo.svg";
import { Link } from "react-router-dom";

const NavBar = (props) => {
  return (
    <div>
      <Navbar2 bg="light" expand="lg">
        <Navbar2.Brand as={Link} to="/">
          <img
            src={logoImage}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Maskr Logo"
          />
          <span>Maskr</span>
        </Navbar2.Brand>
        <Navbar2.Toggle aria-controls="basic-navbar-nav" />
        <Navbar2.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={"/report"}>
              Report
            </Nav.Link>
            <Nav.Link as={Link} to={"/review"}>
              Review Business
            </Nav.Link>
          </Nav>
          <Nav className="pull-right">
            {!props.authenticated ? (
              <Nav.Link className="pull-right" as={Link} to="/login">
                Login
              </Nav.Link>
            ) : (
              <Nav.Link className="pull-right" as={Link} to="/logout">
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar2.Collapse>
      </Navbar2>
    </div>
  );
};

export default NavBar;
