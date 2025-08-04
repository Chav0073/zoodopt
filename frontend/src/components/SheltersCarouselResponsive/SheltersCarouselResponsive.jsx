import { Carousel, Card, Stack, Button } from "react-bootstrap";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SheltersCarouselResponsive.css";

const SheltersCarouselResponsive = ({ shelters }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? shelters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === shelters.length - 1 ? 0 : prev + 1));
  };

  const handleEditClick = (e, id) => {
    e.preventDefault();
    navigate(`/admin/shelters/edit/${id}`);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-nowrap justify-content-end align-items-center mb-3 gap-2">
          <div className="carousel-btn-group mb-3">
            <Button variant="primary" className="carousel-btn" onClick={handlePrev}>
              <FaChevronLeft />
            </Button>
            <Button variant="primary" className="carousel-btn" onClick={handleNext}>
              <FaChevronRight />
            </Button>
          </div>
      </div>

      <Carousel
        indicators={false}
        controls={false}
        activeIndex={index}
        onSelect={setIndex}
      >
        {shelters.map((chunk, idx) => (
          <Carousel.Item key={idx} style={{ height: 400 }}>
            <Stack
              direction="horizontal"
              className="h-100 justify-content-center align-items-center gap-3 flex-wrap"
            >
              {(Array.isArray(chunk) ? chunk : [chunk]).map((shelter) => (
                <Card
                  className="shelter-card"
                  style={{ maxWidth: 220, minWidth: 180 }}
                  key={shelter.id}
                >
                  <Card.Body>
                    <Card.Title>{shelter.name}</Card.Title>
                    <Card.Text className="card-text">{shelter.phone}</Card.Text>
                    <Card.Text className="card-text">
                      {shelter.description}
                    </Card.Text>
                    <Card.Text className="card-text">{shelter.location}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={(e) => handleEditClick(e, shelter.id)}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </Stack>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default SheltersCarouselResponsive;
