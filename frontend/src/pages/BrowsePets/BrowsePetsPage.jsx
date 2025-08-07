import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaSearch, FaMapMarkerAlt, FaHeart, FaFilter } from "react-icons/fa";
import fetchPets from "../../helpers/fetchPets";
import fetchShelters from "../../helpers/fetchShelters";
import { useAuth } from "../../../context/AuthContext";
import PetCard from "../../components/PetCard/PetCard";
import "./BrowsePetsPage.css";

const BrowsePetsPage = () => {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    petType: "",
    ageGroup: "",
    location: "",
    gender: "",
    breed: "",
  });

  // Fetch pets and shelters data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pets and shelters using helper functions
        const [petsData, sheltersData] = await Promise.all([
          fetchPets(),
          fetchShelters(token),
        ]);

        // Create a map of shelters for easy lookup
        const shelterMap = {};
        if (sheltersData) {
          sheltersData.forEach((shelter) => {
            shelterMap[shelter.id] = shelter;
          });
        }

        // Enrich pets with shelter data
        const enrichedPets = petsData
          ? petsData.map((pet) => ({
              ...pet,
              shelterData: shelterMap[pet.shelterId] || null,
              shelterLocation:
                shelterMap[pet.shelterId]?.location || "Unknown Location",
            }))
          : [];

        // Only show available pets
        const availablePets = enrichedPets.filter(
          (pet) => pet.status === "Available"
        );

        setPets(availablePets);
        setFilteredPets(availablePets);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter pets whenever filters change
  useEffect(() => {
    let filtered = pets;

    // Search filter (name, breed, description)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm) ||
          pet.breed.toLowerCase().includes(searchTerm) ||
          pet.description.toLowerCase().includes(searchTerm)
      );
    }

    // Pet type filter
    if (filters.petType) {
      filtered = filtered.filter(
        (pet) => pet.type.toLowerCase() === filters.petType.toLowerCase()
      );
    }

    // Age group filter
    if (filters.ageGroup) {
      filtered = filtered.filter((pet) => {
        const age = parseInt(pet.ageGroup) || 0;
        const petAgeGroup = pet.ageGroup.toLowerCase();

        switch (filters.ageGroup) {
          case "Puppy":
          case "Young":
          case "Puppy/Kitten":
            return (
              age === 0 ||
              petAgeGroup === "puppy" ||
              petAgeGroup === "kitten" ||
              petAgeGroup === "young" ||
              petAgeGroup === "baby" ||
              (age >= 0 && age <= 1)
            );
          case "Adult":
            return petAgeGroup === "adult" || (age >= 1 && age <= 7);
          case "Senior":
            return petAgeGroup === "senior" || age > 7;
          default:
            return true;
        }
      });
    }

    // Location filter
    if (filters.location.trim()) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter((pet) =>
        pet.shelterLocation.toLowerCase().includes(locationTerm)
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(
        (pet) => pet.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    // Breed filter
    if (filters.breed.trim()) {
      const breedTerm = filters.breed.toLowerCase();
      filtered = filtered.filter((pet) =>
        pet.breed.toLowerCase().includes(breedTerm)
      );
    }

    setFilteredPets(filtered);
  }, [filters, pets]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      petType: "",
      ageGroup: "",
      location: "",
      gender: "",
      breed: "",
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value.trim() !== "").length;
  };

  if (loading) {
    return (
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading pets...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div
      className="browse-pets-page"
      style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <section className="browse-header bg-primary text-white py-3">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={11} sm={10} md={9} lg={8} xl={7} className="text-center">
              <h1 className="h2 fw-bold mb-2">Browse Pets</h1>
              <p className="mb-0">
                Find your perfect companion from {pets.length} adorable pets
                waiting for their forever homes
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mobile Search and Filters Section - Only show on mobile */}
      <section className="py-4 bg-white border-bottom d-lg-none">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={11} sm={10}>
              {/* Main Search Bar */}
              <div className="mb-4">
                <InputGroup size="lg" className="shadow-sm">
                  <InputGroup.Text className="bg-light border-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, breed, or description..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="border-0 bg-light"
                  />
                </InputGroup>
              </div>

              {/* Filter Toggle Button */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="d-flex align-items-center gap-2"
                >
                  <FaFilter size={14} />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge bg="primary" className="ms-1">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>

                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Collapsible Filters */}
              {showFilters && (
                <div className="filters-section bg-light rounded-3 p-4 mb-4">
                  <Row className="g-3">
                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Pet Type
                        </Form.Label>
                        <Form.Select
                          value={filters.petType}
                          onChange={(e) =>
                            handleFilterChange("petType", e.target.value)
                          }
                        >
                          <option value="">All Types</option>
                          <option value="Dog">Dogs</option>
                          <option value="Cat">Cats</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Age Group
                        </Form.Label>
                        <Form.Select
                          value={filters.ageGroup}
                          onChange={(e) =>
                            handleFilterChange("ageGroup", e.target.value)
                          }
                        >
                          <option value="">All Ages</option>
                          <option value="Puppy/Kitten">Puppy/Kitten</option>
                          <option value="Adult">Adult</option>
                          <option value="Senior">Senior</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Gender</Form.Label>
                        <Form.Select
                          value={filters.gender}
                          onChange={(e) =>
                            handleFilterChange("gender", e.target.value)
                          }
                        >
                          <option value="">All Genders</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Location
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City or location..."
                          value={filters.location}
                          onChange={(e) =>
                            handleFilterChange("location", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Breed</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Breed name..."
                          value={filters.breed}
                          onChange={(e) =>
                            handleFilterChange("breed", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Results Summary */}
              <div className="results-summary">
                <p className="text-muted mb-0">
                  Showing {filteredPets.length} of {pets.length} pets
                  {getActiveFilterCount() > 0 && " (filtered)"}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Desktop Layout with Sidebar - Only show on desktop */}
      <section className="py-4 d-none d-lg-block">
        <Container fluid>
          <Row className="g-0">
            {/* Fixed Sidebar for Filters */}
            <Col lg={3} xl={2} className="browse-sidebar">
              <div className="browse-sidebar-content">
                <div className="browse-sidebar-header">
                  <h5 className="mb-3 fw-bold">
                    <FaFilter className="me-2" />
                    Filters
                  </h5>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={clearFilters}
                      className="w-100 mb-3"
                    >
                      Clear All ({getActiveFilterCount()})
                    </Button>
                  )}
                </div>

                <div className="browse-sidebar-filters">
                  {/* Search */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Search
                    </Form.Label>
                    <InputGroup className="shadow-sm">
                      <InputGroup.Text className="bg-white border-end-0">
                        <FaSearch className="text-muted" size={14} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Name, breed..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="border-start-0"
                      />
                    </InputGroup>
                  </div>

                  {/* Pet Type */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Pet Type
                    </Form.Label>
                    <Form.Select
                      value={filters.petType}
                      onChange={(e) =>
                        handleFilterChange("petType", e.target.value)
                      }
                      className="shadow-sm"
                    >
                      <option value="">All Types</option>
                      <option value="Dog">Dogs</option>
                      <option value="Cat">Cats</option>
                    </Form.Select>
                  </div>

                  {/* Age Group */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Age Group
                    </Form.Label>
                    <Form.Select
                      value={filters.ageGroup}
                      onChange={(e) =>
                        handleFilterChange("ageGroup", e.target.value)
                      }
                      className="shadow-sm"
                    >
                      <option value="">All Ages</option>
                      <option value="Puppy/Kitten">Puppy/Kitten</option>
                      <option value="Adult">Adult</option>
                      <option value="Senior">Senior</option>
                    </Form.Select>
                  </div>

                  {/* Gender */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Gender
                    </Form.Label>
                    <Form.Select
                      value={filters.gender}
                      onChange={(e) =>
                        handleFilterChange("gender", e.target.value)
                      }
                      className="shadow-sm"
                    >
                      <option value="">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Form.Select>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Location
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City or location..."
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                      className="shadow-sm"
                    />
                  </div>

                  {/* Breed */}
                  <div className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Breed
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Breed name..."
                      value={filters.breed}
                      onChange={(e) =>
                        handleFilterChange("breed", e.target.value)
                      }
                      className="shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </Col>

            {/* Main Content Area */}
            <Col lg={9} xl={10} className="browse-main-content">
              <div className="browse-pets-content">
                {/* Results Summary */}
                <div className="d-flex justify-content-between align-items-center mb-4 px-3">
                  <p className="text-muted mb-0">
                    Showing {filteredPets.length} of {pets.length} pets
                    {getActiveFilterCount() > 0 && " (filtered)"}
                  </p>
                </div>

                {/* Pets Grid */}
                {filteredPets.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <FaHeart size={64} className="text-muted" />
                    </div>
                    <h3 className="text-muted mb-3">No pets found</h3>
                    <p className="text-muted mb-4">
                      Try adjusting your filters or search terms to find more
                      pets.
                    </p>
                    <Button variant="primary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <Row className="g-3 px-3">
                    {filteredPets.map((pet) => (
                      <Col
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={3}
                        xxl={2}
                        key={pet.id}
                      >
                        <PetCard pet={pet} className="browse-variant" />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mobile Pets Grid Section - Only show on mobile */}
      <section className="py-5 d-lg-none">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={11} sm={10}>
              {filteredPets.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <FaHeart size={64} className="text-muted" />
                  </div>
                  <h3 className="text-muted mb-3">No pets found</h3>
                  <p className="text-muted mb-4">
                    Try adjusting your filters or search terms to find more
                    pets.
                  </p>
                  <Button variant="primary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <Row className="g-4">
                  {filteredPets.map((pet) => (
                    <Col xs={12} sm={12} md={6} lg={4} xl={4} key={pet.id}>
                      <PetCard pet={pet} className="browse-variant" />
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default BrowsePetsPage;
