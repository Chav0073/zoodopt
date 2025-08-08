import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchShelter from "../../helpers/fetchShelter";
import EditShelter from "../../components/EditShelter/EditShelter";
import { useAuth } from "../../../context/AuthContext";

const EditShelterPage = () => {
    const { shelterId } = useParams();
    const [shelter, setShelter] = useState(null);
    const {token} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchShelter(token, shelterId);
            setShelter(data);
        };

        fetchData();
    }, [shelterId]);

    return (
        <>
            {shelter ? <EditShelter shelter={shelter} shelterId={shelterId} /> : <p>Loading...</p>}
        </>
    );
};

export default EditShelterPage;
