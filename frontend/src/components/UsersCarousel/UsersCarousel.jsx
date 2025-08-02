import {
    Carousel, Card, Stack, Button
} from "react-bootstrap";
import { useContext } from "react";
import chunkArray from "../../helpers/chunkArray";
import { useWindowSize } from '@uidotdev/usehooks';
import UsersCarouselSm from "../UsersCarouselSm/UsersCarouselSm";
import UsersCarouselLg from "../UsersCarouselLg/UsersCarouselLg";
import UsersCarouselMd from "../UsersCarouselMd/UsersCarouselMd";
import UsersContext from "../../../context/UsersContext";
import './UsersCarousel.css';

const UsersCarousel = () => {
    const users = useContext(UsersContext);
    const size = useWindowSize();

    const users3Chunks = chunkArray(users, 3); 
    const users2Chunks = chunkArray(users, 2);

    console.log(users);

    return (
        <>
            <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
                <h2 className="mb-0 fw-bold text-primary">Users</h2>
                <Button variant="outline-primary" className="fw-semibold px-4 py-2">
                    Users List
                </Button>
            </div>
            {size.width <= 576 ? (
                <UsersCarouselSm users={users}/>
            ) : size.width > 576 && size.width <= 992 ? (
                <UsersCarouselMd users={users2Chunks} />
            ) : (
                <UsersCarouselLg users={users3Chunks} />
            )}
        </>
    );
};

export default UsersCarousel;
