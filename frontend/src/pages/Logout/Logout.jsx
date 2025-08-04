import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();              // clear auth data
    navigate("/");    // redirect to login page
  }, [logout, navigate]);

  return null; // or you can return a spinner or message if desired
};

export default Logout;
