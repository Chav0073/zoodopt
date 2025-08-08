import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import fetchShelters from "../../helpers/fetchShelters";
import {useAuth} from "../../../context/AuthContext";

const CreateUserPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Public");
  const [shelterId, setShelterId] = useState("");
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState("");
  const {token} = useAuth();

  useEffect(() => {
    const loadShelters = async () => {
      const data = await fetchShelters(token);
      if (data) {
        setShelters(data);
        setShelterId(data[0]?.id || "");
      }
    };

    if (role === "ShelterStaff") {
      loadShelters();
    }
  }, [role]);

  const handleBack = () => {
    navigate("/admin/users");
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit.";
    }

    if (role === "ShelterStaff" && !shelterId) {
      return "Shelter must be selected for Shelter Staff role.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      email,
      password,
      role,
      ...(role === "ShelterStaff" && shelterId ? { shelterId: parseInt(shelterId) } : {}),
    };

    try {
      const response = await fetch("http://localhost:5217/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // required for privileged accounts
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || data.title || "Failed to create user.");
      }

      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Create User</h2>
        <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleBack}>
          Back to Users List
        </Button>
      </div>

      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="userEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="userPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="At least 8 chars, one upper, one lower, one digit"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="userRole">
          <Form.Label>Role</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="Public">Public</option>
            <option value="ShelterStaff">Shelter Staff</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        </Form.Group>

        {role === "ShelterStaff" && (
          <Form.Group className="mb-4" controlId="shelterId">
            <Form.Label>Assign to Shelter</Form.Label>
            <Form.Select value={shelterId} onChange={(e) => setShelterId(e.target.value)} required>
              {shelters.map((shelter) => (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="fw-semibold px-4">
          Create User
        </Button>
      </Form>
    </div>
  );
};

export default CreateUserPage;
