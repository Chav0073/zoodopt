import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import fetchPets from "../../helpers/fetchPets";
import ManagePetsTable from "../ManagePetsTable/ManagePetsTable";
import CreatePetBtn from "../CreatePetBtn/CreatePetBtn";

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    loadPets();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  // ✅ Callback to remove deleted pet from state
  const handlePetDeleted = (deletedId) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== deletedId));
  };

  return (
    <div className="bg-light rounded p-4 pb-5">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Pets</h2>
        <div>
          <CreatePetBtn />
          <Button
            variant="outline-primary"
            className="fw-semibold px-4 py-2"
            onClick={handleClick}
          >
            Back to Admin Dashboard
          </Button>
        </div>
      </div>

      {/* ✅ Pass the handler to ManagePetsTable */}
      <ManagePetsTable pets={pets} onPetDeleted={handlePetDeleted} />
    </div>
  );
};

export default ManagePets;
