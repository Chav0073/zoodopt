// src/components/ManageApplications/ManageApplications.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button, Table, Spinner, Form } from "react-bootstrap";

const ManageApplications = () => {
  const { token, role } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5217/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch applications");

      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ShelterStaff" || role === "Admin") {
      fetchApplications();
    }
  }, [token, role]);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5217/applications/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      await fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5217/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete application");

      await fetchApplications();
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application.");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <p className="text-danger mt-4">{error}</p>;

  return (
    <div className="mt-5">
      <h3 className="fw-bold text-primary mb-3">Adoption Applications</h3>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pet</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Message</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.petName}</td>
                <td>{app.status}</td>
                <td>{formatDate(app.submittedAt)}</td>
                <td>{app.message}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={updatingId === app.id}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="outline-primary" onClick={fetchApplications}>
        Refresh
      </Button>
    </div>
  );
};

export default ManageApplications;
