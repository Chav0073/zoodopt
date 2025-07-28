import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import SheltersContext from "../../../context/SheltersContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import SheltersCarouselSm from "../SheltersCarouselSm/SheltersCarouselSm";

const ManageSheltersCarousel = () => {
    const shelters = useContext(SheltersContext);
    const shelterChunks = chunkArray(shelters, 2); // 3 per page

    return (
        <div>
            <h1 className="text-center fw-bold my-2">Shelters</h1>
            <p>{size.width}</p>
            <div className="container-fluid">
                <Carousel>
                    {shelterChunks.map((chunk, index) => (
                        <Carousel.Item key={index} style={{ height: 300 }}>
                            <Stack
                                direction="horizontal"
                                className="h-100 justify-content-center align-items-center"
                                gap={3}
                            >
                                {chunk.map((shelter, idx) => (
                                    <Card key={idx} style={{ width: "18rem" }}>
                                        <Card.Body>
                                            <Card.Title>{shelter.name}</Card.Title>
                                            <Card.Text>{shelter.description}</Card.Text>
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

export default ManageSheltersCarousel;
