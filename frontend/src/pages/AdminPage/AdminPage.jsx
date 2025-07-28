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
        return <p>Please, sign in.</p>
    }

    if(user.role !== "admin"){
        return <AccessDenied />
    }

    return <>
        <h1>
            Dashboard 
        </h1>
        <Outlet />
    </>
}

export default AdminPage;