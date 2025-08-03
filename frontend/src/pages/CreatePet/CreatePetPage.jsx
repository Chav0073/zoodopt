import { useState, useEffect } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import fetchShelters from "../../helpers/fetchShelters";

const CreatePetPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("Dog");
  const [ageGroup, setAgeGroup] = useState("Puppy");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [shelterId, setShelterId] = useState("");
  const [shelters, setShelters] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadShelters = async () => {
      const data = await fetchShelters(token);
      if (data) {
        setShelters(data);
        setShelterId(data[0]?.id || "");
      }
    };
    loadShelters();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !ageGroup || !shelterId) {
      setError("Name, type, age group, and shelter ID are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("ageGroup", ageGroup);
    formData.append("description", description);
    formData.append("shelterId", shelterId);
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      const response = await fetch("http://localhost:5217/pets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Failed to create pet.");
      }

      navigate("/admin/pets");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Pet</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="type" className="mb-3">
          <Form.Label>Type*</Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="ageGroup" className="mb-3">
          <Form.Label>Age Group*</Form.Label>
          <Form.Select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            required
          >
            <option>Puppy</option>
            <option>Adult</option>
            <option>Senior</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="imageFile" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group controlId="shelterId" className="mb-3">
          <Form.Label>Shelter*</Form.Label>
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

        <Button type="submit" variant="primary">
          Create Pet
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePetPage;
