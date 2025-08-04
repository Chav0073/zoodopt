// components/UsersCarousel/UsersCarousel.jsx

import { Carousel, Card, Stack, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useWindowSize from "../../hooks/useWindowSize";
import chunkArray from "../../helpers/chunkArray";
import fetchUsers from "../../helpers/fetchUsers";
import { useAuth } from "../../../context/AuthContext";
import "./UsersCarousel.css";

const UsersCarousel = () => {
  const { token } = useAuth();
  const screenWidth = useWindowSize();

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const fetchedUsers = await fetchUsers(token);
      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
      setLoading(false);
    };

    if (token) {
      loadUsers();
    }
  }, [token]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? chunkedUsers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === chunkedUsers.length - 1 ? 0 : prev + 1));
  };

  const usersPerSlide =
    screenWidth < 576 ? 1 : screenWidth < 992 ? 2 : 3;

  const chunkedUsers = chunkArray(users, usersPerSlide);

  const carouselKey =
    screenWidth < 576
      ? "xs"
      : screenWidth < 768
      ? "sm"
      : screenWidth < 992
      ? "md"
      : "lg";

  return (
    <>
      <div className="container-fluid py-4 px-3 mb-4 d-flex align-items-center justify-content-between bg-white rounded shadow-sm">
        <h2 className="mb-0 fw-bold text-primary">Users</h2>
        <Button variant="outline-primary" className="fw-semibold px-4 py-2">
          Users List
        </Button>
      </div>

      <div className="container-fluid">
        <div className="d-flex justify-content-end mb-3 gap-2 flex-wrap flex-sm-nowrap">
          <Button variant="primary" className="carousel-btn" onClick={handlePrev}>
            <FaChevronLeft />
          </Button>
          <Button variant="primary" className="carousel-btn" onClick={handleNext}>
            <FaChevronRight />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Carousel
            indicators={false}
            controls={false}
            activeIndex={index}
            onSelect={setIndex}
            key={carouselKey}
          >
            {chunkedUsers.map((userGroup, idx) => (
              <Carousel.Item key={idx} style={{ height: 350 }}>
                <Stack
                  direction="horizontal"
                  className="h-100 justify-content-center align-items-center gap-3 flex-wrap"
                >
                  {userGroup.map((user, cardIdx) => (
                    <Card className="user-card" key={user.id || cardIdx}>
                      <Card.Body>
                        <Card.Title>{user.name}</Card.Title>
                        <Card.Text className="card-text">{user.email}</Card.Text>
                        <Card.Text className="card-text">{user.role}</Card.Text>
                        <Button variant="primary">Edit</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </Stack>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </>
  );
};

export default UsersCarousel;
