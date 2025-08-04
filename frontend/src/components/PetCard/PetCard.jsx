import { Card, Button, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import "./PetCard.css";

const PetCard = ({ pet, showFullDescription = false, className = "" }) => {
  const {
    id,
    name,
    breed,
    age,
    ageGroup,
    gender,
    description,
    imageFileName,
    status,
    shelterLocation,
  } = pet;

  const isHomepageVariant = className.includes("homepage-variant");

  if (isHomepageVariant) {
    return (
      <div className="pet-card homepage-variant">
        <div className="pet-image-container">
          <img
            src={`http://localhost:5217/images/${imageFileName}`}
            alt={name}
            className="pet-image"
            onError={(e) => {
              e.target.src = "/images/placeholder-pet.jpg";
            }}
          />
          <div className="pet-name-overlay">
            <h5 className="pet-name-text">{name}</h5>
          </div>

          <div className="pet-hover-overlay">
            <div className="pet-info-content">
              <div className="pet-details">
                <div className="detail-item">
                  <span className="pet-breed">{breed}</span>
                </div>
                <div className="detail-item">
                  <span className="pet-age-gender">
                    {ageGroup || `${age} years old`} • {gender}
                  </span>
                </div>
                {shelterLocation && (
                  <div className="detail-item pet-location">
                    <FaMapMarkerAlt size={12} />
                    <span>{shelterLocation}</span>
                  </div>
                )}
                <div className="pet-description">{description}</div>
              </div>
              <div className="pet-actions">
                <LinkContainer to={`/pets/adopt/${id}`}>
                  <Button variant="primary" className="w-100 pet-button">
                    <FaHeart size={14} />
                    Adopt Me
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`pet-card h-100 shadow-sm border-0 ${className}`}>
      <div className="pet-image-container">
        <Card.Img
          variant="top"
          src={`http://localhost:5217/images/${imageFileName}`}
          alt={name}
          className="pet-image"
          onError={(e) => {
            e.target.src = "/images/placeholder-pet.jpg";
          }}
        />
        {status === "Available" && (
          <div className="pet-status-badge">
            <Badge bg="success" className="status-badge">
              Available
            </Badge>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column pet-body">
        <div className="flex-grow-1">
          <Card.Title className="pet-title">{name}</Card.Title>

          <div className="pet-details">
            <div className="detail-item">
              <span className="pet-breed">{breed}</span>
            </div>
            <div className="detail-item">
              <span className="pet-age-gender">
                {ageGroup || `${age} years old`} • {gender}
              </span>
            </div>
            {shelterLocation && (
              <div className="detail-item pet-location">
                <FaMapMarkerAlt size={12} />
                <span>{shelterLocation}</span>
              </div>
            )}
          </div>

          <Card.Text
            className={`pet-description ${
              showFullDescription ? "full-description" : ""
            }`}
          >
            {description}
          </Card.Text>
        </div>

        <div className="mt-auto">
          <LinkContainer to={`/pets/adopt/${id}`}>
            <Button variant="primary" className="w-100 pet-button">
              <FaHeart size={14} />
              Adopt Me
            </Button>
          </LinkContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PetCard;
