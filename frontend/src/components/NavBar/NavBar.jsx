import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../public/images/logo.svg";
import "./NavBar.css";

const NavBar = () => {
  const { token, role } = useAuth();
  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container fluid style={{ maxWidth: "1400px" }}>
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
              <LinkContainer to="/browse-pets">
                <NavDropdown.Item>Browse All Pets</NavDropdown.Item>
              </LinkContainer>
              {token && (
                <>
                  <NavDropdown.Divider />
                  <LinkContainer to="/pets/my-applications">
                    <NavDropdown.Item>My Applications</NavDropdown.Item>
                  </LinkContainer>
                </>
              )}
              {role === "Admin" && (
                <>
                  <NavDropdown.Divider />
                  <LinkContainer to="/admin/pets">
                    <NavDropdown.Item>Manage Pets</NavDropdown.Item>
                  </LinkContainer>
                </>
              )}
            </NavDropdown>

            {/* Admin Section - Only visible for Admin users */}
            {role === "Admin" && (
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
            )}
          </Nav>

          {/* Right side navigation */}
          <Nav className="ms-auto">
            {token ? (
              // User is logged in - show logout
              <LinkContainer to="/logout">
                <Nav.Link>Logout</Nav.Link>
              </LinkContainer>
            ) : (
              // User is not logged in - show login/register
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
