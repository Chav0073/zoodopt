import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useState } from "react";
import SheltersContext from "../../../context/SheltersContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const SheltersCarouselMd = ({ shelters }) => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? shelters.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === shelters.length - 1 ? 0 : prev + 1));
    };

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
                <Carousel
                    indicators={false}
                    controls={false}
                    activeIndex={index}
                    onSelect={setIndex}
                >
                    {shelters.map((shelter, idx) => (
                        <Carousel.Item key={idx} style={{ height: 500 }}>
                            <Stack
                                direction="horizontal"
                                className="h-100 justify-content-center align-items-center"
                                gap={3}
                            >
                                {shelter.map((shelter, cardIdx) => (
                                    <Card className="shelter-card" key={shelter.id || cardIdx}>
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
                                ))}
                            </Stack>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default SheltersCarouselMd;
