import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import PetsContext from "../../../context/PetsContext";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import PetsCarouselSm from "../PetsCarouselSm/PetsCarouselSm";
import PetsCarouselMd from "../PetsCarouselMd/PetsCarouselMd";
import PetsCarouselLg from "../PetsCarouselLg/PetsCarouselLg";
import "./PetsCarousel.css";
import { useNavigate } from 'react-router';

const PetsCarousel = () => {
    const pets = useContext(PetsContext);
    const size = useWindowSize();
    const navigate = useNavigate();

    const pets3Chunks = chunkArray(pets, 3); 
    const pets2Chunks = chunkArray(pets, 2);

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin/pets");
    }

    return (
        <>
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Pets</h2>
                <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={(e) => handleClick(e)}>
                    Pets List
                </Button>
            </div>
            {size.width <= 576 ? (
                <PetsCarouselSm pets={pets}/>
            ) : size.width > 576 && size.width <= 992 ? (
                <PetsCarouselMd pets={pets2Chunks} />
            ) : (
                <PetsCarouselLg pets={pets3Chunks} />
            )}
        </>
    );
};

export default PetsCarousel;
