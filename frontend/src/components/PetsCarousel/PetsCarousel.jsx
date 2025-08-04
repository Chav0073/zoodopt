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
  const [petsChunks, setPetsChunks] = useState([]);
  const [chunkSize, setChunkSize] = useState(1);
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

  // Debounce resize logic
  useEffect(() => {
    const handler = setTimeout(() => {
      let newChunkSize = 1;
      if (size.width > 576 && size.width <= 768) newChunkSize = 2;
      else if (size.width > 768 && size.width <= 992) newChunkSize = 3;
      else if (size.width > 992 && size.width <= 1200) newChunkSize = 4;
      else if (size.width > 1200) newChunkSize = 5;

      setChunkSize(newChunkSize);
      setPetsChunks(chunkArray(pets, newChunkSize));
    }, 150); // 150ms delay after resize stops

    return () => clearTimeout(handler);
  }, [size.width, pets]);

  return (
    <>
      <div className="container-fluid py-4 px-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between bg-white rounded shadow-sm gap-3">
        <h2 className="mb-0 fw-bold text-primary">Pets</h2>
        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
          <div className="w-auto">
            <CreatePetBtn />
          </div>
          <Button
            variant="outline-primary"
            className="fw-semibold px-4 py-2 w-auto"
            onClick={() => navigate("/admin/pets")}
          >
            Pets List
          </Button>
        </div>
      </div>

      {petsChunks.length > 0 && (
        <PetsCarouselResponsive pets={petsChunks} />
      )}
    </>
  );
};

export default PetsCarousel;
