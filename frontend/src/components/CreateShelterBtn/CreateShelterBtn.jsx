import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateShelterBtn = () => {
    let navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin/shelters/create")
    }
 
    return <Button variant="primary" className="fw-semibold px-4 py-2 me-sm-3" onClick={(e) => handleClick(e)}>
            Create a Shelter
        </Button>
}

export default CreateShelterBtn;