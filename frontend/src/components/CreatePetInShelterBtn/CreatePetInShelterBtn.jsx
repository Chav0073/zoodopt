import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreatePetInShelterBtn = ({id}) => {
    let navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate(`/shelter/${id}/create`);
    }

    return <Button variant="primary" className="fw-semibold px-4 py-2 me-sm-3" onClick={(e) => handleClick(e)}>
            Create a Pet
        </Button>
}

export default CreatePetInShelterBtn ;