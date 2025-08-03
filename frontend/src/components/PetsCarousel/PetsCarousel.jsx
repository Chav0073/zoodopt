import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useState, useEffect } from "react";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import PetsCarouselSm from "../PetsCarouselSm/PetsCarouselSm";
import PetsCarouselMd from "../PetsCarouselMd/PetsCarouselMd";
import PetsCarouselLg from "../PetsCarouselLg/PetsCarouselLg";
import "./PetsCarousel.css";
import { useNavigate } from 'react-router';
import CreatePetBtn from "../CreatePetBtn/CreatePetBtn";
import fetchPets from "../../helpers/fetchPets"; // Adjust the path accordingly

const PetsCarousel = () => {
    const [pets, setPets] = useState([]);
    const size = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {
        const getPets = async () => {
            try {
                const data = await fetchPets();
                setPets(data);
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        getPets();
    }, []);

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
                <div>
                    <CreatePetBtn />
                    <Button variant="outline-primary" className="fw-semibold px-4 py-2" onClick={handleClick}>
                        Pets List
                    </Button>
                </div>
            </div>
            {size.width <= 576 ? (
                <PetsCarouselSm pets={pets} />
            ) : size.width > 576 && size.width <= 992 ? (
                <PetsCarouselMd pets={pets2Chunks} />
            ) : (
                <PetsCarouselLg pets={pets3Chunks} />
            )}
        </>
    );
};

export default PetsCarousel;
