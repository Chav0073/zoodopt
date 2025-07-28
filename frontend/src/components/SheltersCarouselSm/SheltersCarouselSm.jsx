import {
  Carousel,
  Card,
  Stack,
  Button
} from "react-bootstrap";
import './SheltersCarouselSm.css';

const SheltersCarouselSm = ({ shelters }) => {
  return (
    <div className="container-fluid mt-5">
      <Carousel indicators={false}>
        {shelters.map((shelter, index) => (
          <Carousel.Item key={index} style={{ height: 400 }}>
            <Stack
              direction="horizontal"
              className="h-100 justify-content-center align-items-center"
              gap={3}
            >
              <Card className="shelter-card">
                <Card.Img
                  variant="top"
                  src="../../../public/images/shelterimg.jpg"
                  alt="shelter image"
                  className="card-img-top"
                />
                <Card.Body>
                  <Card.Title>{shelter.name}</Card.Title>
                  <Card.Text className="card-text">
                    {shelter.phone}
                  </Card.Text>
                  <Card.Text className="card-text">
                    {shelter.description}
                  </Card.Text>
                  <Card.Text className="card-text">
                    {shelter.location}
                  </Card.Text>
                  <Button variant="primary">Edit</Button>
                </Card.Body>
              </Card>
            </Stack>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default SheltersCarouselSm;
