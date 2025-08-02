import SheltersContext from "../../../context/SheltersContext";
import { useContext } from "react";
import ManageSheltersTable from "../ManageSheltersTable/ManageSheltersTable";
import { Button } from "react-bootstrap";

const ManageShelters = () => {
    const shelters = useContext(SheltersContext);
    return <>
        <div className="bg-light rounded p-4 pb-5">
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Shelters</h2>
                <Button variant="outline-primary" className="fw-semibold px-4 py-2">
                    Back to Admin Dashboard
                </Button>
            </div>
            <ManageSheltersTable shelters={shelters} />
        </div>
    </>
    
}

export default ManageShelters;