import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import PetsGrid from "../../components/PetsGrid/PetsGrid";
import SheltersShowcase from "../../components/SheltersShowcase/SheltersShowcase";

const HomePage = () => {
  const [stats, setStats] = useState({
    dogsCount: 0,
    catsCount: 0,
    sheltersCount: 0,
    adoptedCount: 0,
    loading: true,
  });

  const [searchFilters, setSearchFilters] = useState({
    city: "",
    petType: "", // "dog", "cat", or ""
  });

  const [filteredPets, setFilteredPets] = useState([]);
  const [allPets, setAllPets] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = "http://localhost:5217";

        // Fetch pets, shelters data (no auth required)
        const [petsResponse, sheltersResponse] = await Promise.all([
          fetch(`${baseUrl}/pets`),
          fetch(`${baseUrl}/shelters`),
        ]);

        const pets = await petsResponse.json();
        const shelters = await sheltersResponse.json();

        // Create a map of shelters for easy lookup
        const shelterMap = {};
        shelters.forEach((shelter) => {
          shelterMap[shelter.id] = shelter;
        });

        // Enrich pets with full shelter location data
        const enrichedPets = pets.map((pet) => ({
          ...pet,
          shelterLocation: shelterMap[pet.shelterId]?.location || "",
          shelterFullData: shelterMap[pet.shelterId] || null,
        }));

        // Store all pets for filtering
        setAllPets(enrichedPets);
        setFilteredPets(enrichedPets); // Initially show all pets

        // Count dogs and cats
        const dogsCount = pets.filter(
          (pet) => pet.type.toLowerCase() === "dog"
        ).length;

        const catsCount = pets.filter(
          (pet) => pet.type.toLowerCase() === "cat"
        ).length;

        // Count adopted pets (pets with status "Adopted")
        const adoptedCount = pets.filter(
          (pet) => pet.status === "Adopted"
        ).length;

        setStats({
          dogsCount,
          catsCount,
          sheltersCount: shelters.length,
          adoptedCount,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default values on error
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Filter pets whenever search filters change
  useEffect(() => {
    const filterPets = () => {
      let filtered = allPets;

      // Filter by pet type (exact match with Type field from database)
      if (searchFilters.petType) {
        filtered = filtered.filter(
          (pet) =>
            pet.type.toLowerCase() === searchFilters.petType.toLowerCase()
        );
      }

      // Filter by city (search in shelter location from shelters table)
      if (searchFilters.city.trim()) {
        filtered = filtered.filter((pet) => {
          const searchCity = searchFilters.city.toLowerCase();
          const shelterLocation = pet.shelterLocation?.toLowerCase() || "";
          const shelterName = pet.shelterName?.toLowerCase() || "";

          // Search in both shelter location and shelter name
          return (
            shelterLocation.includes(searchCity) ||
            shelterName.includes(searchCity)
          );
        });
      }

      // Only show available pets
      filtered = filtered.filter((pet) => pet.status === "Available");

      setFilteredPets(filtered);
    };

    filterPets();
  }, [searchFilters, allPets]);

  const handleCitySearch = (e) => {
    setSearchFilters((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handlePetTypeFilter = (type) => {
    setSearchFilters((prev) => ({
      ...prev,
      petType: prev.petType === type ? "" : type, // Toggle filter
    }));
  };
  return (
    <>
      {/* Hero Section */}
      <section
        className="hero-section text-white position-relative"
        style={{
          backgroundImage: "url(public/images/homepage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>

        <Container
          className="position-relative"
          fluid
          style={{ maxWidth: "1600px" }}
        >
          <Row className="justify-content-center text-center">
            <Col xs={10} sm={10} md={8} lg={8} xl={6}>
              <h1 className="display-2 fw-bold mb-4">Find, Love, Adopt</h1>
              <p className="lead mb-5 fs-4">Helping homeless pets find home</p>
            </Col>
          </Row>

          {/* Search Section */}
          <Row className="justify-content-center">
            <Col xs={11} sm={10} md={8} lg={7} xl={6}>
              {/* Mobile: Stack vertically */}
              <div className="d-block d-sm-none">
                <div className="bg-white rounded-4 p-3 mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light rounded-3 mb-3"
                    placeholder="Type city..."
                    value={searchFilters.city}
                    onChange={handleCitySearch}
                    style={{ height: "50px" }}
                  />
                  <Row className="g-2">
                    <Col xs={6}>
                      <Button
                        variant={
                          searchFilters.petType === "dog"
                            ? "success"
                            : "primary"
                        }
                        size="lg"
                        className="w-100 rounded-3"
                        onClick={() => handlePetTypeFilter("dog")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          height: "50px",
                          fontSize: "14px",
                        }}
                      >
                        <img
                          src="/images/dogIcon.svg"
                          alt="Dog icon"
                          width="16"
                          height="16"
                          style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <span>Dog</span>
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant={
                          searchFilters.petType === "cat"
                            ? "success"
                            : "primary"
                        }
                        size="lg"
                        className="w-100 rounded-3"
                        onClick={() => handlePetTypeFilter("cat")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          height: "50px",
                          fontSize: "14px",
                        }}
                      >
                        <img
                          src="/images/catIcon.svg"
                          alt="Cat icon"
                          width="16"
                          height="16"
                          style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <span>Cat</span>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Desktop: Horizontal layout */}
              <div className="d-none d-sm-block">
                <div
                  className="bg-white rounded-4 overflow-hidden"
                  style={{
                    display: "flex",
                    padding: 0,
                    margin: "0 auto",
                  }}
                >
                  <div style={{ flex: "1 1 40%" }}>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light rounded-0 h-100"
                      placeholder="Type city..."
                      value={searchFilters.city}
                      onChange={handleCitySearch}
                      style={{ height: "60px" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 30%" }}>
                    <Button
                      variant={
                        searchFilters.petType === "dog" ? "success" : "primary"
                      }
                      size="lg"
                      className="w-100 h-100 rounded-0 border-0"
                      onClick={() => handlePetTypeFilter("dog")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        height: "60px",
                      }}
                    >
                      <img
                        src="/images/dogIcon.svg"
                        alt="Dog icon"
                        width="20"
                        height="20"
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                      <span>Find a dog</span>
                    </Button>
                  </div>
                  <div style={{ flex: "1 1 30%" }}>
                    <Button
                      variant={
                        searchFilters.petType === "cat" ? "success" : "primary"
                      }
                      size="lg"
                      className="w-100 h-100 rounded-0 border-0"
                      onClick={() => handlePetTypeFilter("cat")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        height: "60px",
                      }}
                    >
                      <img
                        src="/images/catIcon.svg"
                        alt="Cat icon"
                        width="20"
                        height="20"
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                      <span>Find a cat</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pets to Adopt Section */}
      <section className="py-5">
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="justify-content-center">
            <Col xs={11} sm={10} md={9} lg={8} xl={7}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-dark">
                  {searchFilters.petType
                    ? `${
                        searchFilters.petType.charAt(0).toUpperCase() +
                        searchFilters.petType.slice(1)
                      }s to adopt`
                    : "Pets to adopt"}
                  {searchFilters.city && ` in ${searchFilters.city}`}
                </h2>
                <p className="lead text-muted">
                  {filteredPets.length === 0
                    ? "No pets found matching your search criteria"
                    : `Showing ${filteredPets.length} ${
                        filteredPets.length === 1 ? "pet" : "pets"
                      } waiting for their forever homes`}
                </p>
                {(searchFilters.city || searchFilters.petType) && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSearchFilters({ city: "", petType: "" })}
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          {/* Full width for PetsGrid */}
          <Row>
            <Col xs={12}>
              <PetsGrid
                pets={filteredPets}
                maxPets={10}
                variant="homepage"
                showViewMoreButton={true}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Zoodopt in numbers Section */}
      <section className="py-5">
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="justify-content-center">
            <Col xs={11} sm={10} md={9} lg={8} xl={7}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-primary">
                  Zoodopt in numbers
                </h2>
              </div>
            </Col>
          </Row>
          <Row className="g-4 text-center justify-content-center">
            <Col xs={6} sm={6} md={3} lg={3}>
              <div className="p-4">
                <div className="mb-3">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="fw-bold text-primary mb-2">
                  {stats.loading ? "..." : stats.dogsCount}
                </h3>
                <p className="text-muted mb-0">Number of dogs to adopt</p>
              </div>
            </Col>
            <Col xs={6} sm={6} md={3} lg={3}>
              <div className="p-4">
                <div className="mb-3">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="fw-bold text-primary mb-2">
                  {stats.loading ? "..." : stats.sheltersCount}
                </h3>
                <p className="text-muted mb-0">
                  Number of shelters and organizations
                </p>
              </div>
            </Col>
            <Col xs={6} sm={6} md={3} lg={3}>
              <div className="p-4">
                <div className="mb-3">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="fw-bold text-primary mb-2">
                  {stats.loading ? "..." : stats.catsCount}
                </h3>
                <p className="text-muted mb-0">Number of cats to adopt</p>
              </div>
            </Col>
            <Col xs={6} sm={6} md={3} lg={3}>
              <div className="p-4">
                <div className="mb-3">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="fw-bold text-primary mb-2">
                  {stats.loading ? "..." : stats.adoptedCount}
                </h3>
                <p className="text-muted mb-0">Number of adopted animals</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Partner Shelters Section */}
      <section className="py-5 bg-light">
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="justify-content-center">
            <Col xs={11} sm={10} md={9} lg={8} xl={7}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold text-primary">
                  Our Partner Shelters
                </h2>
                <p className="lead text-muted">
                  Working with trusted organizations to help pets find homes
                </p>
              </div>
            </Col>
          </Row>
          {/* Full width for SheltersShowcase */}
          <Row>
            <Col xs={12}>
              <SheltersShowcase />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="justify-content-center">
            <Col
              xs={11}
              sm={10}
              md={8}
              lg={6}
              xl={5}
              className="text-center text-white"
            >
              <h2 className="display-5 fw-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="lead mb-4">
                Join thousands of families who have found their perfect
                companions through ZooDopt
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <LinkContainer to="/browse-pets">
                  <Button
                    variant="warning"
                    size="lg"
                    className="px-5 mb-2 fw-semibold"
                  >
                    Start Browsing
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-5 mb-2 fw-semibold"
                    style={{ borderWidth: "2px" }}
                  >
                    Register Today
                  </Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
