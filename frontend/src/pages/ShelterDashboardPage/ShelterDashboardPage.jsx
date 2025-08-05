import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagePetsInShelter from "../../components/ManagePetsInShelter/ManagePetsInShelter";
import { Button } from "react-bootstrap";
import CreatePetInShelterBtn from "../../components/CreatePetInShelterBtn/CreatePetInShelterBtn";

const ShelterDashboardPage = () => {
  const { shelterId } = useParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!shelterId) {
          console.error("No shelterId in URL.");
          return;
        }

        const petsRes = await fetch("http://localhost:5217/pets");

        if (!petsRes.ok) {
          throw new Error("Failed to fetch pets");
        }

        const allPets = await petsRes.json();

        const filteredPets = allPets.filter(
          (pet) => pet.shelterId?.toString() === shelterId.toString()
        );

        setPets(filteredPets);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shelterId, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handlePetDeleted = (deletedId) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== deletedId));
  };

  return (
    <>
      <div className="container-fluid px-3 px-md-4 py-4">
        <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
          <h2 className="mb-0 fw-bold text-primary">Pets</h2>
          <div>
            <CreatePetInShelterBtn id={shelterId}/>
            <Button
              variant="outline-primary"
              className="fw-semibold px-4 py-2"
              onClick={handleClick}
            >
              Back to Home Page
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ManagePetsInShelter pets={pets} onPetDeleted={handlePetDeleted} />
        )}
      </div>
    </>
  );
};

export default ShelterDashboardPage;
