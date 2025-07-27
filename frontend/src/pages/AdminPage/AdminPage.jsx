import { useContext } from "react";
import { Outlet } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import PetsContext from "../../../context/PetsContext";
import SheltersContext from "../../../context/SheltersContext";

const AdminPage = () => {
    const user = useContext(UserContext);
    const pets = useContext(PetsContext);
    const shelters = useContext(SheltersContext);

    if(user.role !== "admin"){
        return <p>ACCESS DENIED</p>
    }

    return <>
        {
        }
        <h1>
            Dashboard 
        </h1>
        {
            console.log(user, pets, shelters)
        }
        <Outlet />
    </>
}

export default AdminPage;