import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import fetchShelters from "../../helpers/fetchShelters";
import "./SheltersShowcase.css";

const SheltersShowcase = ({
  title = "Our Partner Shelters",
}) => {
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
            <Col key={shelter.id} xs={12} sm={6} md={4} lg={3} className="shelter-col">
              <Card className="shelter-showcase-card">
                <Card.Body className="shelter-card-body">
                  <Card.Title className="shelter-name">
                    {shelter.name}
                  </Card.Title>

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
};

export default SheltersShowcase;
