import { Carousel, Card, Stack, Button } from "react-bootstrap";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./PetsCarouselResponsive.css";
import { useNavigate } from "react-router-dom";

const PetsCarouselResponsive = ({ pets }) => {
  const [index, setIndex] = useState(0);
  let navigate = useNavigate();

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? pets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
  };

  const handleRedirect = (e, id) => {
    e.preventDefault();
    navigate(`/admin/pets/edit/${id}`);
  }

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


      <Carousel indicators={false} controls={false} activeIndex={index} onSelect={setIndex}>
        {pets.map((chunk, idx) => (
          <Carousel.Item key={idx} style={{ height: 500 }}>
            <Stack
              direction="horizontal"
              className="h-100 justify-content-center align-items-center gap-3 flex-wrap"
            >
              {(Array.isArray(chunk) ? chunk : [chunk]).map((pet, cardIdx) => (
                <Card className="pet-card" style={{ maxWidth: 220, minWidth: 180 }} key={pet.id || cardIdx}>
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5217/images/${pet.imageFileName}`}
                    alt="pet image"
                    className="card-img-top"
                  />
                  <Card.Body>
                    <Card.Title>{pet.name}</Card.Title>
                    <Card.Text className="card-text">{pet.shelterId}</Card.Text>
                    <Card.Text className="card-text">{pet.description}</Card.Text>
                    <Card.Text className="card-text">{pet.status}</Card.Text>
                    <Button variant="primary" onClick={(e) => handleRedirect(e, pet.id)}>Edit</Button>
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

export default PetsCarouselResponsive;
