import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdoptPetPage.css";
import Spinner from "react-bootstrap/Spinner";

const AdoptPetPage = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:5217/pets/${id}`);
        if (res.status === 404) {
          setError("NOT_FOUND");
          return;
        }
        if (!res.ok) {
          setError("GENERAL");
          return;
        }
        const data = await res.json();
        setPet(data);
      } catch (err) {
        setError("GENERAL");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    // Check if user is logged in
    if (!token) {
      setSubmitError("");
      setIsSubmitting(false);
      // Show a user-friendly message with login options
      const shouldLogin = window.confirm(
        "You need to be logged in to adopt a pet. Would you like to log in now?\n\n" +
          "Click 'OK' to go to login page, or 'Cancel' to sign up for a new account."
      );

      if (shouldLogin) {
        navigate("/login");
      } else {
        navigate("/register");
      }
      return;
    }

    try {
      const res = await fetch("http://localhost:5217/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId: parseInt(id),
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.title || data.message || "Submission failed.";
        throw new Error(errorMessage);
      }

      navigate("/pets/my-applications");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) return <p>Loading pet...</p>;

  // Not found
  if (error === "NOT_FOUND") {
    return (
      <div className="full-page-wrapper bg-gradient-primary">
        <div className="status-box fade-in">
          <div className="emoji-large">🐾</div>
          <h3 className="status-text">No Pets Found</h3>
          <p className="status-subtext">There are no pets with that ID.</p>
        </div>
      </div>
    );
  }

  // General error
  if (error === "GENERAL") {
    return (
      <p className="text-danger">An error occurred while loading the pet.</p>
    );
  }

  return (
    <div className="container mt-4 p-0" style={{ maxWidth: "600px" }}>
      <div className="card border-0 shadow-lg adopt-container">
        <div className="adopt-header">
          <h2>Adopt {pet.name}</h2>
        </div>

        <div className="card-body p-4">
          {submitError && (
            <div
              className="alert alert-danger border-0 mb-4 alert-shake"
              role="alert"
            >
              <i className="fas fa-exclamation-triangle me-2"></i>
              {submitError}
            </div>
          )}

          <div className="text-center mb-4 adopt-image-container">
            <img
              src={`http://localhost:5217/images/${pet.imageFileName}`}
              alt={pet.name}
              className="img-fluid rounded adopt-image"
            />
          </div>

          <div className="mb-4">
            <div className="adopt-detail-box">
              <p className="mb-0">
                🐾 <strong>Type:</strong> {pet.type}
              </p>
            </div>
            <div
              className="adopt-detail-box"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="mb-0">
                📅 <strong>Age Group:</strong> {pet.ageGroup}
              </p>
            </div>
            <div
              className="adopt-detail-box"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="mb-0">ℹ️ {pet.description}</p>
            </div>
          </div>

          {!token && (
            <div className="alert alert-info mb-4 text-center">
              <h5 className="mb-2">💡 Want to adopt {pet.name}?</h5>
              <p className="mb-2">
                You need to create an account or log in to submit an adoption
                application.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {token && (
            <div className="adopt-form-container">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h3 htmlFor="message" className="form-label pb-2">
                    Why do you want to adopt {pet.name}?
                  </h3>
                  <textarea
                    id="message"
                    className="form-control border-0 adopt-textarea"
                    rows="6"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder={`Tell us why you'd be a great match for ${pet.name}...`}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn border-0 w-100 fw-semibold adopt-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptPetPage;
