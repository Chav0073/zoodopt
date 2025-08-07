import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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

    // Double-check authentication before submitting
    if (!token) {
      setSubmitError(
        "You must be logged in to submit an adoption application. Please login first."
      );
      return;
    }

    setIsSubmitting(true);

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

      if (res.status === 401) {
        setSubmitError(
          "Your session has expired. Please login again to submit your application."
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        let errorMessage = "Submission failed. Please try again.";

        if (data.title) {
          errorMessage = data.title;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          // Handle validation errors
          const errorMessages = Object.values(data.errors).flat();
          errorMessage = errorMessages.join(", ");
        }

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

  // Not authenticated - show login prompt
  if (!token && pet) {
    return (
      <div className="container mt-4 p-0" style={{ maxWidth: "600px" }}>
        <div className="card border-0 shadow-lg adopt-container">
          <div className="adopt-header">
            <h2>Adopt {pet.name}</h2>
          </div>

          <div className="card-body p-4">
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

            <Alert variant="info" className="text-center">
              <h4 className="alert-heading">
                <i className="fas fa-user-lock me-2"></i>
                Login Required
              </h4>
              <p className="mb-3">
                You need to be logged in to submit an adoption application for{" "}
                <strong>{pet.name}</strong>.
              </p>
              <hr />
              <div className="d-flex gap-2 justify-content-center">
                <LinkContainer
                  to={{
                    pathname: "/login",
                    search: `?redirect=/pets/adopt/${id}`,
                  }}
                >
                  <Button variant="primary" size="lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Button>
                </LinkContainer>
                <LinkContainer
                  to={{
                    pathname: "/register",
                    search: `?redirect=/pets/adopt/${id}`,
                  }}
                >
                  <Button variant="outline-primary" size="lg">
                    <i className="fas fa-user-plus me-2"></i>
                    Register
                  </Button>
                </LinkContainer>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // Pet not available for adoption
  if (pet && pet.status !== "Available") {
    return (
      <div className="container mt-4 p-0" style={{ maxWidth: "600px" }}>
        <div className="card border-0 shadow-lg adopt-container">
          <div className="adopt-header">
            <h2>{pet.name}</h2>
          </div>

          <div className="card-body p-4">
            <div className="text-center mb-4 adopt-image-container">
              <img
                src={`http://localhost:5217/images/${pet.imageFileName}`}
                alt={pet.name}
                className="img-fluid rounded adopt-image"
              />
            </div>

            <Alert variant="warning" className="text-center">
              <h4 className="alert-heading">
                <i className="fas fa-heart me-2"></i>
                No Longer Available
              </h4>
              <p className="mb-3">
                <strong>{pet.name}</strong> is no longer available for adoption.
                {pet.status === "Adopted"
                  ? " This pet has already found a loving home!"
                  : ""}
              </p>
              <hr />
              <div className="d-flex gap-2 justify-content-center">
                <LinkContainer to="/browse-pets">
                  <Button variant="primary" size="lg">
                    <i className="fas fa-search me-2"></i>
                    Browse Other Pets
                  </Button>
                </LinkContainer>
              </div>
            </Alert>
          </div>
        </div>
      </div>
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
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptPetPage;
