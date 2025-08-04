import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateUserBtn = () => {
    let navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin/users/create")
    }
 
    return <Button variant="primary" className="fw-semibold px-4 py-2 me-sm-3" onClick={(e) => handleClick(e)}>
            Create a User
        </Button>
}

export default CreateUserBtn;