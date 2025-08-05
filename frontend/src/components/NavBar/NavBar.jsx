import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../public/images/logo.svg";
import "./NavBar.css";
import { useState } from "react";
import { useEffect } from "react";

const NavBar = () => {
  const { token, role } = useAuth();
  const [shelterId, setShelterId] = useState();

   useEffect(() => {
    const fetchShelterInfo = async () => {
      if (role === "ShelterStaff" && token) {
        try {
          const response = await fetch("http://localhost:5217/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch shelter info");

          const data = await response.json();
          setShelterId(data.shelterId);
        } catch (error) {
          console.error("Error fetching shelter info:", error);
        }
      }
    };

    fetchShelterInfo();
  }, [token, role]);


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

            {/* Shelter Staff Section */}
            {role === "ShelterStaff" && (

              <LinkContainer to={`/shelter/${shelterId}`}>
                <Nav.Link>Shelter Dashboard</Nav.Link>
              </LinkContainer>
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
