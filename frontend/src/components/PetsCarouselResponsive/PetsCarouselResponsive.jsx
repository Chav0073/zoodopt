// components/PetsCarouselResponsive.jsx

import { Carousel, Card, Stack, Button } from "react-bootstrap";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./PetsCarouselResponsive.css";

const PetsCarouselResponsive = ({ pets }) => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? pets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap justify-content-end mb-3 gap-2">
        <Button variant="primary" className="w-auto" onClick={handlePrev}>
          <FaChevronLeft />
        </Button>
        <Button variant="primary" className="w-auto" onClick={handleNext}>
          <FaChevronRight />
        </Button>
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
                    <Button variant="primary">Edit</Button>
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
