import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import SheltersContext from "../../../context/SheltersContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import SheltersCarouselSm from "../SheltersCarouselSm/SheltersCarouselSm";
import SheltersCarouselMd from "../SheltersCarousuelMd/SheltersCarouselMd";

const ManageSheltersCarousel = () => {
    const shelters = useContext(SheltersContext);
    const size = useWindowSize();

    const shelter3Chunks = chunkArray(shelters, 3); 
    const shelter2Chunks = chunkArray(shelters, 2);

    if(size.width <= 576){
        return <SheltersCarouselSm shelters={shelters}/>
    }

    if(size.width > 576 && size.width <= 992){
        return <SheltersCarouselMd shelters={shelter2Chunks} />
    }

    return (
        <p>Big screen</p>
        // <div>
        //     <h1 className="text-center fw-bold my-2">Shelters</h1>
        //     <p>{size.width}</p>
        //     <div className="container-fluid">
        //         <Carousel>
        //             {shelterChunks.map((chunk, index) => (
        //                 <Carousel.Item key={index} style={{ height: 300 }}>
        //                     <Stack
        //                         direction="horizontal"
        //                         className="h-100 ms-5 align-items-center"
        //                         gap={3}
        //                     >
        //                         {chunk.map((shelter, idx) => (
        //                             <Card key={idx} className="h-90" style={{ width: "18rem" }}>
        //                                 <Card.Body>
        //                                     <Card.Title>{shelter.name}</Card.Title>
        //                                     <Card.Text>{shelter.description}</Card.Text>
        //                                     <Button variant="primary">Edit</Button>
        //                                 </Card.Body>
        //                             </Card>
        //                         ))}
        //                     </Stack>
        //                 </Carousel.Item>
        //             ))}
        //         </Carousel>
        //     </div>
        // </div>
    );
};

export default ManageSheltersCarousel;
