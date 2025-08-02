import SheltersContext from "../../../context/SheltersContext";
import { useContext } from "react";
import ManageSheltersTable from "../ManageSheltersTable/ManageSheltersTable";

const ManageShelters = () => {
    const shelters = useContext(SheltersContext);
    return <ManageSheltersTable shelters={shelters} />
    
}

export default ManageShelters;