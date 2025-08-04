import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../../public/images/logo.svg";

const NavBar = () => {
  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container fluid>
        <div
          className="d-flex justify-content-between align-items-center w-100"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 15px" }}
        >
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                alt="Zoodopt Logo"
                height="40"
                className="d-inline-block align-top me-2"
              />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>

              {/* Pets Section */}
              <NavDropdown title="Pets" id="pets-dropdown">
                <LinkContainer to="/">
                  <NavDropdown.Item>Browse All Pets</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/pets">
                  <NavDropdown.Item>Manage Pets</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              {/* Admin Section */}
              <NavDropdown title="Admin" id="admin-dropdown">
                <LinkContainer to="/admin">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/shelters">
                  <NavDropdown.Item>Manage Shelters</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>Manage Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>

            {/* Right side navigation */}
            <Nav>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
