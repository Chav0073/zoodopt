import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import PetsContext from "../../../context/PetsContext";
import SheltersContext from "../../../context/SheltersContext";
import AccessDenied from "../../components/AccessDenied/AccessDenied";
import SheltersCarousel from "../../components/SheltersCarousel/SheltersCarousel";
import PetsCarousel from "../../components/PetsCarousel/PetsCarousel";
import UsersContext from "../../../context/UsersContext";
import UsersCarousel from "../../components/UsersCarousel/UsersCarousel";

const AdminPage = () => {
    const user = useContext(UserContext);
    const pets = useContext(PetsContext);
    const shelters = useContext(SheltersContext);
    const users = useContext(UsersContext);
    const location = useLocation();

    if (user == null) {
        return (
            <p className="text-center mt-5 fs-5 text-secondary px-3">
                Please, sign in.
            </p>
        );
    }

    if (user.role !== "admin") {
        return <AccessDenied />;
    }

    const isIndexRoute = location.pathname === "/admin";

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="bg-white rounded shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
                <h1 className="mb-0 fw-bold text-primary text-center text-md-start w-100">
                    Admin Dashboard
                </h1>
            </div>

            {isIndexRoute ? (
                <>
                    <div className="bg-light rounded p-3 p-md-4 mb-4">
                        <SheltersCarousel />
                    </div>
                    <div className="bg-light rounded p-3 p-md-4 mb-4">
                        <PetsCarousel />
                    </div>
                    <div className="bg-light rounded p-3 p-md-4 mb-3">
                        <UsersCarousel />
                    </div>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default AdminPage;
