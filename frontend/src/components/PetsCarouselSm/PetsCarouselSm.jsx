import {
  Carousel,
  Card,
  Stack,
  Button
} from "react-bootstrap";
import './PetsCarouselSm.css';
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const PetsCarouselSm = ({ pets }) => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? pets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="d-flex justify-content-end mb-3 gap-2">
          <Button variant="primary" onClick={handlePrev}>
                                  <span aria-hidden="true"><FaChevronLeft /></span>
                              </Button>
                              <Button variant="primary" onClick={handleNext}>
                                  <span aria-hidden="true"><FaChevronRight /></span>
                              </Button>
        </div>
        <Carousel indicators={false} controls={false} activeIndex={index}
                    onSelect={setIndex}>
          {pets.map((pet, index) => (
            <Carousel.Item key={index} style={{ height: 500 }}>
              <Stack
                direction="horizontal"
                className="h-100 justify-content-center align-items-center"
                gap={3}
              >
                <Card className="pet-card">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5217/images/${pet.imageFileName}`}
                    alt={`${pet.imageUrl}`}
                    className="card-img-top"
                  />
                  <Card.Body>
                    <Card.Title>{pet.name}</Card.Title>
                    <Card.Text className="card-text">
                      {pet.shelterId}
                    </Card.Text>
                    <Card.Text className="card-text">
                      {pet.description}
                    </Card.Text>
                    <Card.Text className="card-text">
                      {pet.status}
                    </Card.Text>
                    <Button variant="primary">Edit</Button>
                  </Card.Body>
                </Card>
              </Stack>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default PetsCarouselSm;
