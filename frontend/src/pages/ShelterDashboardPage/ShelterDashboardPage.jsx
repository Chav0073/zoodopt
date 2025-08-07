import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagePetsInShelter from "../../components/ManagePetsInShelter/ManagePetsInShelter";
import { Button } from "react-bootstrap";
import CreatePetInShelterBtn from "../../components/CreatePetInShelterBtn/CreatePetInShelterBtn";
import { useAuth } from "../../../context/AuthContext";
import ManageApplications from "../../components/ManageApplications/ManageApplications";

const ShelterDashboardPage = () => {
  const { shelterId } = useParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userShelterId, setUserShelterId] = useState(null);
  const navigate = useNavigate();
  const { token, role } = useAuth();

  // Fetch logged-in user's shelterId if they're shelter staff
  useEffect(() => {
    const fetchShelterInfo = async () => {
      if (role === "ShelterStaff" && token) {
        try {
          const response = await fetch("http://localhost:5217/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch shelter info");

          const data = await response.json();
          setUserShelterId(data.shelterId);
        } catch (error) {
          console.error("Error fetching shelter info:", error);
        }
      }
    };

    fetchShelterInfo();
  }, [token, role]);

  // Redirect shelter staff if shelterId in URL is not theirs
  useEffect(() => {
    if (role === "ShelterStaff" && userShelterId !== null) {
      if (shelterId.toString() !== userShelterId.toString()) {
        navigate("/"); // Redirect to homepage
      }
    }
  }, [role, userShelterId, shelterId, navigate]);

  // Fetch pets if access is valid
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
  }, [shelterId]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handlePetDeleted = (deletedId) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== deletedId));
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Pets</h2>
        <div>
          <CreatePetInShelterBtn id={shelterId} />
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
        <>
          <ManagePetsInShelter pets={pets} onPetDeleted={handlePetDeleted} />
          <ManageApplications shelterId={shelterId} />
        </>
      )}
    </div>
  );
};

export default ShelterDashboardPage;
