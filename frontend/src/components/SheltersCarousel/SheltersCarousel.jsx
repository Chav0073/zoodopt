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
import { useNavigate } from "react-router";

const SheltersCarousel = () => {
    const shelters = useContext(SheltersContext);
    const size = useWindowSize();
    const navigate = useNavigate();

    const shelter3Chunks = chunkArray(shelters, 3); 
    const shelter2Chunks = chunkArray(shelters, 2);

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin/shelters");
    }   

    return (
        <>
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Shelters</h2>
                <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={(e) => handleClick(e)}>
                    Shelters List
                </Button>
            </div>
            {size.width <= 576 ? (
                <SheltersCarouselSm shelters={shelters}/>
            ) : size.width > 576 && size.width <= 992 ? (
                <SheltersCarouselMd shelters={shelter2Chunks} />
            ) : (
                <SheltersCarouselLg shelters={shelter3Chunks} />
            )}
        </>
    );
};

export default SheltersCarousel;
