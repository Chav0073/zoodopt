import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const EditShelter = ({ shelter, shelterId }) => {
    const [name, setName] = useState(shelter.name);
    const [location, setLocation] = useState(shelter.location);
    const [email, setEmail] = useState(shelter.email || "");
    const [phone, setPhone] = useState(shelter.phone || "");
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedShelter = {
            ...shelter,
            name,
            location,
            email,
            phone,
        };

        try {
            const res = await fetch(`http://localhost:5217/shelters/${shelterId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedShelter),
            });

            if (res.ok) {
                alert("Shelter updated!");
                navigate("/admin/shelters");
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
                <h2 className="mb-0 fw-bold text-primary">Edit Shelter</h2>
                <Button
                    variant="outline-primary"
                    className="fw-semibold px-4 py-2"
                    onClick={() => navigate("/admin/shelters")}
                >
                    Back to Shelters
                </Button>
            </div>

            <div className="container-fluid bg-white rounded shadow-sm p-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Shelter Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Location</Form.Label>
                        <Form.Control
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
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

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            pattern="^[0-9+\s()\-]*$"
                            required
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

export default EditShelter;
