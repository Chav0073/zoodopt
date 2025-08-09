import { useState, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import fetchPet from "../../helpers/fetchPet";

const isValidImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file && allowedTypes.includes(file.type) && file.size <= maxSize;
};

const EditPetInShelter = ({shelterId}) => {
  const { petId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPet(petId);
        setPet(data);
        setName(data.name);
        setType(data.type);
        setAgeGroup(data.ageGroup);
        setDescription(data.description || "");
        setPhotoPreview(data.imageUrl ? `http://localhost:5217${data.imageUrl}` : "");
      } catch (err) {
        console.error(err);
        alert("Failed to load pet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [petId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && !isValidImageFile(file)) {
      alert("Invalid file type or file too large (max 5MB).");
      e.target.value = null;
      return;
    }
    setPhotoFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(pet?.imageUrl ? `http://localhost:5217${pet.imageUrl}` : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("ageGroup", ageGroup);
    formData.append("description", description || "");
    formData.append("shelterId", pet.shelterId.toString());

    if (photoFile) {
      formData.append("imageFile", photoFile);
    }

    try {
      const res = await fetch(`http://localhost:5217/pets/${petId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Pet updated!");
        navigate("/");
      } else {
        const err = await res.json();
        alert("Failed: " + err.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Edit Pet</h2>
        <Button
          variant="outline-primary"
          className="fw-semibold px-4 py-2"
          onClick={() => navigate("/admin/pets")}
        >
          Back to Pets
        </Button>
      </div>

      <div className="container-fluid bg-white rounded shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Pet Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Type</Form.Label>
            <Form.Control
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Age Group</Form.Label>
            <Form.Control
              type="text"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Photo</Form.Label>
            {photoPreview && (
              <div className="mb-2">
                <Image
                  src={photoPreview}
                  alt="Pet preview"
                  thumbnail
                  style={{ maxHeight: 200 }}
                />
              </div>
            )}
            <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
          </Form.Group>

          <Button type="submit" variant="primary" className="fw-semibold px-4 py-2">
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditPetInShelter;
