import { useContext } from "react";
import { Outlet } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import PetsContext from "../../../context/PetsContext";
import SheltersContext from "../../../context/SheltersContext";
import AccessDenied from "../../components/AccessDenied/AccessDenied";

const AdminPage = () => {
    const user = useContext(UserContext);
    // const user = null;
    const pets = useContext(PetsContext);
    const shelters = useContext(SheltersContext);

    if(user == null){
        return <p className="text-center mt-5 fs-4 text-secondary">Please, sign in.</p>
    }

    if(user.role !== "admin"){
        return <AccessDenied />
    }

    return (
        <div className="container py-5">
            <div className="bg-white rounded shadow-sm p-4 mb-4 d-flex align-items-center">
                <h1 className="mb-0 fw-bold text-primary flex-grow-1">Dashboard</h1>
            </div>
            <div className="bg-light rounded p-4">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminPage;