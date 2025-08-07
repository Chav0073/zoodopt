import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import fetchShelters from "../../helpers/fetchShelters";
import "./SheltersShowcase.css";

const SheltersShowcase = ({ title = "Our Partner Shelters" }) => {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const getShelters = async () => {
      try {
        const data = await fetchShelters();
        setShelters(data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };
    getShelters();
  }, []);

  return (
    <div className="shelters-showcase">
      <div className="shelters-showcase-header">
        <h2 className="shelters-showcase-title">{title}</h2>
      </div>

      {shelters.length > 0 && (
        <Row className="shelters-grid">
          {shelters.map((shelter) => (
            <Col
              key={shelter.id}
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={4}
              className="shelter-col"
            >
              <Card className="shelter-showcase-card">
                {/* Shelter Logo */}
                <div className="shelter-logo-container">
                  <img
                    src={`http://localhost:5217/images/${shelter.logo}`}
                    alt={`${shelter.name} logo`}
                    className="shelter-logo"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-shelter.jpg";
                    }}
                  />
                  <div className="shelter-logo-overlay">
                    <div className="shelter-name-badge">{shelter.name}</div>
                  </div>
                </div>

                <Card.Body className="shelter-card-body">
                  <div className="shelter-details">
                    <div className="shelter-detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span className="detail-text">{shelter.location}</span>
                    </div>

                    <div className="shelter-detail-item">
                      <FaPhone className="detail-icon" />
                      <span className="detail-text">{shelter.phone}</span>
                    </div>
                  </div>

                  <Card.Text className="shelter-description">
                    {shelter.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SheltersShowcase;
