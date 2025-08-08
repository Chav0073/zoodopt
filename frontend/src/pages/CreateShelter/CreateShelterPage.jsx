import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getToken from "../../helpers/getToken";
import { useAuth } from "../../../context/AuthContext";


const CreateShelterPage = () => {
const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {token} = useAuth();

  const handleBack = () => {
    navigate("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !phone || !email) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5217/shelters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, phone, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create shelter.");
      }

      navigate("/admin/shelters");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Create Shelter</h2>
        <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleBack}>
          Back to Admin Dashboard
        </Button>
      </div>

      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="shelterName">
          <Form.Label>Shelter Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter shelter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="shelterLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="shelterPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="shelterEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="fw-semibold px-4">
          Create Shelter
        </Button>
      </Form>
    </div>
  );
}

export default CreateShelterPage;