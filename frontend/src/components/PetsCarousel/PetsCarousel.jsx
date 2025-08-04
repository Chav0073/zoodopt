import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router";
import fetchPets from "../../helpers/fetchPets";
import chunkArray from "../../helpers/chunkArray";
import PetsCarouselResponsive from "../PetsCarouselResponsive/PetsCarouselResponsive";
import CreatePetBtn from "../CreatePetBtn/CreatePetBtn";
import "./PetsCarousel.css";

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

  // Determine chunk size based on screen width
  let chunkSize = 1;
  if (size.width > 576 && size.width <= 768) chunkSize = 2;
  else if (size.width > 768 && size.width <= 992) chunkSize = 3;
  else if (size.width > 992 && size.width <= 1200) chunkSize = 4;
  else if (size.width > 1200) chunkSize = 5;

  const petsChunks = chunkArray(pets, chunkSize);

  return (
    <>
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Pets</h2>
        <div>
          <CreatePetBtn />
          <Button
            variant="outline-primary"
            className="fw-semibold px-4 py-2 ms-2"
            onClick={() => navigate("/admin/pets")}
          >
            Pets List
          </Button>
        </div>
      </div>

      <PetsCarouselResponsive pets={petsChunks} />
    </>
  );
};

export default PetsCarousel;
