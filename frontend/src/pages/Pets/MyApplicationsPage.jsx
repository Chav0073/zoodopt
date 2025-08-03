import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplicationsPage.css';

const MyApplicationsPage = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://localhost:5217/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load applications.');
        const apps = await res.json();

        const enrichedApps = await Promise.all(
          apps.map(async (app) => {
            try {
              const petRes = await fetch(`http://localhost:5217/pets/${app.petId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!petRes.ok) throw new Error('Failed to fetch pet data.');

              const pet = await petRes.json();
              return {
                ...app,
                petImageUrl: `http://localhost:5217/images/${pet.imageFileName}`,
                petType: pet.type,
                petAgeGroup: pet.ageGroup,
                petDescription: pet.description,
              };
            } catch (petErr) {
              console.error(`Failed to fetch pet data for application ${app.id}:`, petErr);
              return app;
            }
          })
        );

        setApplications(enrichedApps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleEditClick = (app) => {
    setEditingId(app.id);
    setEditedMessage(app.message);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedMessage('');
  };

  const handleSaveMessage = async (id) => {
    try {
      const res = await fetch(`http://localhost:5217/applications/${id}/message`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: editedMessage }),
      });

      if (!res.ok) throw new Error('Failed to update message.');

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, message: editedMessage } : app))
      );

      setEditingId(null);
      setEditedMessage('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5217/applications/${applicationToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 204) throw new Error('Failed to delete application.');

      setApplications((prev) => prev.filter((app) => app.id !== applicationToDelete));
    } catch (err) {
      alert(err.message);
    } finally {
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setApplicationToDelete(null);
  };

  if (loading) {
    return (
      <div className="full-page-wrapper bg-gradient-primary">
        <div className="status-box fade-in">
          <div className="spinner">⏳</div>
          <h3 className="status-text">Loading your applications...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-page-wrapper bg-gradient-primary">
        <div className="alert-box shake">
          <h4>⚠️ Error</h4>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="full-page-wrapper bg-gradient-primary">
        <div className="status-box fade-in">
          <div className="emoji-large">🐾</div>
          <h3 className="status-text">No Applications Yet</h3>
          <p className="status-subtext">You haven't submitted any adoption applications yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="container py-5">
        <div className="page-header text-center mb-5">
          <h1>My Adoption Applications</h1>
          <p>Track and manage your pet adoption requests</p>
        </div>

        <div className="row g-4">
          {applications.map((app) => (
            <div className="col-md-6" key={app.id}>
              <div className="application-card">
                <div className="card-body p-4">
                  <div
                    className="pet-image"
                    style={{ backgroundImage: `url(${app.petImageUrl})` }}
                  ></div>
                  <h4>{app.petName}</h4>

                  <div className="application-details mb-3">
                    <div>
                      <small>
                        <strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div>
                      <small>
                        <strong>Status:</strong> {app.status}
                      </small>
                    </div>
                    <div>
                      <small>
                        <strong>Type:</strong> {app.petType} • <strong>Age:</strong> {app.petAgeGroup}
                      </small>
                    </div>
                    <div>
                      <small>
                        <strong>Description:</strong> {app.petDescription}
                      </small>
                    </div>
                  </div>

                  <div className="message-box mb-3">
                    <h6>Your Message:</h6>
                    {editingId === app.id ? (
                      <textarea
                        className="form-control mb-3"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <p>"{app.message}"</p>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    {editingId === app.id ? (
                      <>
                        <button className="btn save-btn flex-fill" onClick={() => handleSaveMessage(app.id)}>
                          Save
                        </button>
                        <button className="btn cancel-btn flex-fill" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn edit-btn flex-fill" onClick={() => handleEditClick(app)}>
                          Edit
                        </button>
                        <button className="btn delete-btn flex-fill" onClick={() => handleDeleteClick(app.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-box">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this application?</p>
            <div className="d-flex gap-2 mt-4">
              <button className="btn delete-btn flex-fill" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn cancel-btn flex-fill" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;