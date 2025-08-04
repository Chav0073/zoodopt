import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import fetchShelters from "../../helpers/fetchShelters";

const EditUser = ({ user, userId }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "Public");
  const [shelterId, setShelterId] = useState(user.shelterId || "");
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "ShelterStaff") {
      const token = localStorage.getItem("token");
      fetchShelters(token).then((data) => {
        if (data) {
          setShelters(data);
          if (!shelterId) setShelterId(data[0]?.id || "");
        }
      });
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const updatedUser = {
      name, // still required by backend
      email,
      role,
      ...(role === "ShelterStaff" && shelterId ? { shelterId: parseInt(shelterId) } : {}),
    };

    try {
      const res = await fetch(`http://localhost:5217/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error("Server validation error:", data);
        setError(data.message || data.title || "Failed to update user.");
        return;
      }

      alert("User updated!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Request error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Edit User</h2>
        <Button
          variant="outline-primary"
          className="fw-semibold px-4 py-2"
          onClick={() => navigate("/admin/users")}
        >
          Back to Users
        </Button>
      </div>

      <div className="container-fluid bg-white rounded shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3 d-none">
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              readOnly
              plaintext
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="Public">Public</option>
              <option value="ShelterStaff">Shelter Staff</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>

          {role === "ShelterStaff" && (
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Shelter</Form.Label>
              <Form.Select
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                required
              >
                {shelters.map((shelter) => (
                  <option key={shelter.id} value={shelter.id}>
                    {shelter.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Button type="submit" variant="primary" className="fw-semibold px-4 py-2">
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditUser;
