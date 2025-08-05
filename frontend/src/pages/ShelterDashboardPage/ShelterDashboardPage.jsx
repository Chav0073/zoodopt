import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagePetsTable from "../../components/ManagePetsTable/ManagePetsTable";

const ShelterDashboardPage = () => {
  const { shelterId } = useParams(); // Get from URL
  const [pets, setPets] = useState(null);
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
        // Optional: navigate("/access-denied");
      }
    };

    fetchData();
  }, [shelterId, navigate]);

  return <>{pets ? <ManagePetsTable pets={pets} /> : <p>Loading...</p>}</>;
};

export default ShelterDashboardPage;
