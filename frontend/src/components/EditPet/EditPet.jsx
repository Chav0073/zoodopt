import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditPet = ({ pet, petId }) => {
    const [name, setName] = useState(pet.name);
    const [type, setType] = useState(pet.type);
    const [ageGroup, setAgeGroup] = useState(pet.ageGroup);
    const [description, setDescription] = useState(pet.description || "");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Type", type);
    formData.append("AgeGroup", ageGroup);
    formData.append("Description", description || "");
    formData.append("ShelterId", pet.shelterId.toString());

    try {
        const res = await fetch(`http://localhost:5217/pets/${petId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="fw-semibold px-4 py-2"
                    >
                        Save Changes
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default EditPet;
