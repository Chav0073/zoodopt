import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import SheltersContext from "../../../context/SheltersContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';

const SheltersCarouselMd = ({shelters}) => {

    return (
        <div>
            <div className="container-fluid">
                <Carousel>
                    {shelters.map((shelter, index) => (
                        <Carousel.Item key={index} style={{ height: 500 }}>
                            <Stack
                                direction="horizontal"
                                className="h-100 justify-content-center align-items-center"
                                gap={3}
                            >
                                {shelter.map((shelter, idx) => (
                                    <Card className="shelter-card" key={shelter.id || idx}>
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
