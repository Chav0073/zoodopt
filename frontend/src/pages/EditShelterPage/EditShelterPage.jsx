import { useParams } from "react-router-dom";
import fetchShelters from "../../helpers/fetchShelter";

const EditShelterPage = () => {
    let params = useParams();
    let shelterId = params.shelterId;
    
    let shelter = fetchShelter(getToken(), shelterId);

    return <>
        <p>{shelterId}</p>
    </>
}

export default EditShelterPage;