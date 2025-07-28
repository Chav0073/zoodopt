import { Button } from "react-bootstrap";
import ManageSheltersCarousel from "../../components/ManageSheltersCarousel/ManageSheltersCarousel";

const ManageShelters = () => {
    return (
        <>
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Shelters</h2>
                <Button variant="outline-primary" className="fw-semibold px-4 py-2">
                    Shelters List
                </Button>
            </div>
            <ManageSheltersCarousel />
        </>
    );
}

export default ManageShelters;