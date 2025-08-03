import { useEffect, useState } from "react";
import ManageSheltersTable from "../ManageSheltersTable/ManageSheltersTable";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import CreateShelterBtn from "../CreateShelterBtn/CreateShelterBtn";
import fetchShelters from "../../helpers/fetchShelters";

const ManageShelters = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadShelters = async () => {
        try {
            const data = await fetchShelters();
            setShelters(data);
        } catch (error) {
            console.error("Failed to fetch shelters:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShelters();
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin");
    };

    const handleShelterDeleted = (id) => {
        setShelters((prev) => prev.filter((shelter) => shelter.id !== id));
    };

    return (
        <div className="bg-light rounded p-4 pb-5">
            <div className="container-fluid py-4 px-3 mb-4 bg-white rounded shadow-sm d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <h2 className="mb-0 fw-bold text-primary text-center text-md-start">Shelters</h2>
                <div className="d-flex flex-column flex-sm-row gap-2">
                    <CreateShelterBtn />
                    <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleClick}>
                        Back to Admin Dashboard
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <ManageSheltersTable shelters={shelters} onShelterDeleted={handleShelterDeleted} />
            )}
        </div>
    );
};

export default ManageShelters;
