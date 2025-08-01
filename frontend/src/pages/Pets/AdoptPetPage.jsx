import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './AdoptPetPage.css';

const AdoptPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:5217/pets/${id}`);
        if (!res.ok) throw new Error('Pet not found.');
        const data = await res.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5217/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId: parseInt(id),
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.title || data.message || 'Submission failed.';
        throw new Error(errorMessage);
      }

      navigate('/pets/adopt/3');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading pet...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4 p-0">
      <div className="card border-0 shadow-lg adopt-container">
        <div className="adopt-header">
          <h2>Adopt {pet.name}</h2>
        </div>

        <div className="card-body p-4">
          {submitError && (
            <div className="alert alert-danger border-0 mb-4 alert-shake" role="alert">
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
              <h5 className="mb-0">🐾 <strong>Type:</strong> {pet.type}</h5>
            </div>
            <div className="adopt-detail-box" style={{ animationDelay: '0.1s' }}>
              <h5 className="mb-0">📅 <strong>Age Group:</strong> {pet.ageGroup}</h5>
            </div>
            <div className="adopt-detail-box" style={{ animationDelay: '0.2s' }}>
              <h5 className="mb-0">ℹ️ {pet.description}</h5>
            </div>
          </div>

          <div className="adopt-form-container">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-semibold pb-2" style={{ fontSize: '1.8rem' }}>
                  Why do you want to adopt {pet.name}?
                </label>
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
                      <span className="spinner">⏳</span> Submitting...
                    </>
                  ) : (
                    'Submit Application'
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