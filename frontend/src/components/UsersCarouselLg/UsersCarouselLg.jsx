import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const UsersCarouselLg = ({ users }) => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? users.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === users.length - 1 ? 0 : prev + 1));
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
                    {users.map((user, idx) => (
                        <Carousel.Item key={idx} style={{ height: 300 }}>
                            <Stack
                                direction="horizontal"
                                className="h-100 justify-content-center align-items-center"
                                gap={3}
                            >
                                {user.map((user, cardIdx) => (
                                    <Card className="user-card" key={user.id || cardIdx}>
                                        <Card.Body>
                                            <Card.Title>{user.name}</Card.Title>
                                            <Card.Text className="card-text">
                                                {user.email}
                                            </Card.Text>
                                            <Card.Text className="card-text">
                                                {user.role}
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

export default UsersCarouselLg;
