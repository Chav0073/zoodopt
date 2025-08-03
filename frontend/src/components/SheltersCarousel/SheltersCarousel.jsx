import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useState, useEffect } from "react";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import SheltersCarouselSm from "../SheltersCarouselSm/SheltersCarouselSm";
import SheltersCarouselMd from "../SheltersCarousuelMd/SheltersCarouselMd";
import SheltersCarouselLg from "../SheltersCarouselLg/SheltersCarouselLg";
import { useNavigate } from "react-router";
import CreateShelterBtn from "../CreateShelterBtn/CreateShelterBtn";
import fetchShelters from "../../helpers/fetchShelters"; // Make sure the path is correct

const SheltersCarousel = () => {
    const [shelters, setShelters] = useState([]);
    const size = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {
        const getShelters = async () => {
            try {
                const data = await fetchShelters();
                setShelters(data);
            } catch (error) {
                console.error("Error fetching shelters:", error);
            }
        };

        getShelters();
    }, []);

    const shelter3Chunks = chunkArray(shelters, 3);
    const shelter2Chunks = chunkArray(shelters, 2);

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/admin/shelters");
    };

    return (
        <>
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Shelters</h2>
                <div>
                    <CreateShelterBtn />
                    <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleClick}>
                        Shelters List
                    </Button>
                </div>
            </div>
            {size.width <= 576 ? (
                <SheltersCarouselSm shelters={shelters} />
            ) : size.width > 576 && size.width <= 992 ? (
                <SheltersCarouselMd shelters={shelter2Chunks} />
            ) : (
                <SheltersCarouselLg shelters={shelter3Chunks} />
            )}
        </>
    );
};

export default SheltersCarousel;
