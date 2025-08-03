import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchShelter from "../../helpers/fetchShelter";
import getToken from "../../helpers/getToken";
import EditShelter from "../../components/EditShelter/EditShelter";

const EditShelterPage = () => {
    const { shelterId } = useParams();
    const [shelter, setShelter] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchShelter(getToken(), shelterId);
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
