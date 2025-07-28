import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import SheltersContext from "../../../context/SheltersContext";

const ManageSheltersCarousel = () => {
    const shelters = useContext(SheltersContext);

    console.log(shelters);
    return (
        <div>
            <h1 className="text-center fw-bold my-2"> 
                Shelters
            </h1>
        </div>
    )
}

export default ManageSheltersCarousel;