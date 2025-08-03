import SheltersContext from "../../../context/SheltersContext";
import { useContext } from "react";
import ManageSheltersTable from "../ManageSheltersTable/ManageSheltersTable";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import CreateShelterBtn from "../CreateShelterBtn/CreateShelterBtn";

const ManageShelters = () => {
    const shelters = useContext(SheltersContext);
    let navigate = useNavigate();

    const handleClick = (e) => 
    {
        e.preventDefault();
        navigate("/admin");
    }

    return <>
        <div className="bg-light rounded p-4 pb-5">
            <div className="container-fluid py-4 px-3 mb-4 bg-white rounded shadow-sm d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <h2 className="mb-0 fw-bold text-primary text-center text-md-start">Shelters</h2>
                <div className="d-flex flex-column flex-sm-row gap-2">
                    <CreateShelterBtn/>
                    <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleClick}>
                        Back to Admin Dashboard
                    </Button>
                </div>
            </div>
            <ManageSheltersTable shelters={shelters} />
        </div>
    </>
    
}

export default ManageShelters;