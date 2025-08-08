import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import fetchUsers from "../../helpers/fetchUsers";
import ManageUsersTable from "../ManageUsersTable/ManageUsersTable";
import CreateUserBtn from "../CreateUserBtn/CreateUserBtn";
import { useAuth } from "../../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(token);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    loadUsers();
  }, []);

  const handleUserDeleted = (deletedId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletedId));
  };

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Users</h2>
        <div>
            <CreateUserBtn />
            <Button
              variant="outline-primary"
              className="fw-semibold px-4 py-2"
              onClick={() => navigate("/admin")}
            >
              Back to Admin Dashboard
            </Button>
        </div>
      </div>

      <ManageUsersTable users={users} onUserDeleted={handleUserDeleted} />
    </div>
  );
};

export default ManageUsers;
