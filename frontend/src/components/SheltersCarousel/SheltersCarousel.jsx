import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router";
import fetchShelters from "../../helpers/fetchShelters";
import chunkArray from "../../helpers/chunkArray";
import SheltersCarouselResponsive from "../SheltersCarouselResponsive/SheltersCarouselResponsive";
import CreateShelterBtn from "../CreateShelterBtn/CreateShelterBtn";

const SheltersCarousel = () => {
  const [shelters, setShelters] = useState([]);
  const [shelterChunks, setShelterChunks] = useState([]);
  const [chunkSize, setChunkSize] = useState(1);
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

  // Chunk shelters based on width breakpoint with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      let newChunkSize = 1;
      if (size.width > 576 && size.width <= 768) newChunkSize = 2;
      else if (size.width > 768 && size.width <= 992) newChunkSize = 3;
      else if (size.width > 992 && size.width <= 1200) newChunkSize = 4;
      else if (size.width > 1200) newChunkSize = 5;

      setChunkSize(newChunkSize);
      setShelterChunks(chunkArray(shelters, newChunkSize));
    }, 150);

    return () => clearTimeout(handler);
  }, [size.width, shelters]);

  return (
    <>
      <div className="container-fluid py-4 px-3 mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between bg-white rounded shadow-sm gap-3">
        <h2 className="mb-0 fw-bold text-primary">Shelters</h2>
        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
          <div className="w-auto">
            <CreateShelterBtn />
          </div>
          <Button
            variant="outline-primary"
            className="fw-semibold px-4 py-2 w-auto"
            onClick={() => navigate("/admin/shelters")}
          >
            Shelters List
          </Button>
        </div>
      </div>

      {shelterChunks.length > 0 && (
        <SheltersCarouselResponsive shelters={shelterChunks} />
      )}
    </>
  );
};

export default SheltersCarousel;
