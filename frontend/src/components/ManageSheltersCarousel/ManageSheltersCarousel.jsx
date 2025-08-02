import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import SheltersContext from "../../../context/SheltersContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import SheltersCarouselSm from "../SheltersCarouselSm/SheltersCarouselSm";
import SheltersCarouselMd from "../SheltersCarousuelMd/SheltersCarouselMd";
import SheltersCarouselLg from "../SheltersCarouselLg/SheltersCarouselLg";

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

    return <SheltersCarouselLg shelters={shelter3Chunks} />
};

export default ManageSheltersCarousel;
