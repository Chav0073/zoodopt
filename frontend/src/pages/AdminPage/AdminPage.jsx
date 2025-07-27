import { Outlet } from "react-router-dom";

const AdminPage = () => {
    return <>
        <h1>
            Admin Dashboard 
        </h1>
        <Outlet />
    </>
}

export default AdminPage;