import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AccessDenied from "../../components/AccessDenied/AccessDenied";
import SheltersCarousel from "../../components/SheltersCarousel/SheltersCarousel";
import PetsCarousel from "../../components/PetsCarousel/PetsCarousel";
import UsersCarousel from "../../components/UsersCarousel/UsersCarousel";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

const AdminPage = () => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(role);
        if (role !== "Admin") {
            navigate("/");
        }
    }, [role, navigate]);

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
