import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import fetchUsers from "../../helpers/fetchUsers";
import ManageUsersTable from "../ManageUsersTable/ManageUsersTable";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
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
        <Button
          variant="outline-primary"
          className="fw-semibold px-4 py-2"
          onClick={() => navigate("/admin")}
        >
          Back to Admin Dashboard
        </Button>
      </div>

      <ManageUsersTable users={users} onUserDeleted={handleUserDeleted} />
    </div>
  );
};

export default ManageUsers;
