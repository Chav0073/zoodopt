import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getToken from "../../helpers/getToken";
import fetchPet from "../../helpers/fetchPet";
import EditPet from "../../components/EditPet/EditPet";

const EditPetPage = () => {
    const { petId } = useParams();
    const [ pet, setPet] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPet(petId);
            setPet(data);
        };

        fetchData();
    }, [petId]);

    return (
        <>
            {pet ? <EditPet pet={pet} petId={petId} /> : <p>Loading...</p>}
        </>
    );
};

export default EditPetPage;
