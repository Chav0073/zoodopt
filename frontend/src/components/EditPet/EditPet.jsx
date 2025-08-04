import { useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

const EditPet = ({ pet, petId }) => {
  const [name, setName] = useState(pet.name);
  const [type, setType] = useState(pet.type);
  const [ageGroup, setAgeGroup] = useState(pet.ageGroup);
  const [description, setDescription] = useState(pet.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    pet.imageUrl ? `http://localhost:5217${pet.imageUrl}` : ""
  );
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && !isValidImageFile(file)) {
      alert("Invalid file type or file too large (max 5MB).");
      e.target.value = null; // reset file input
      return;
    }
    setPhotoFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(pet.imageUrl ? `http://localhost:5217${pet.imageUrl}` : "");
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
      formData.append("imageFile", photoFile); // Important: "imageFile"
    }

    try {
      const res = await fetch(`http://localhost:5217/pets/${petId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // DO NOT set Content-Type manually when using FormData
        },
        body: formData,
      });

      if (res.ok) {
        alert("Pet updated!");
        navigate("/admin/pets");
      } else {
        const err = await res.json();
        alert("Failed: " + err.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

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

export default EditPet;
