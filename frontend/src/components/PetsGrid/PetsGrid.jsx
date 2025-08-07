import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import PetCard from "../PetCard/PetCard";
import "./PetsGrid.css";

const PetsGrid = ({
  pets = [],
  maxPets = null,
  variant = "default",
  showViewMoreButton = false,
  title = null,
}) => {
  // Limit pets if maxPets is specified
  const displayPets = maxPets ? pets.slice(0, maxPets) : pets;

  const columnProps =
    variant === "homepage"
      ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 3, xxl: 3 }
      : variant === "browse"
      ? { lg: 4, xl: 3, xxl: 2 }
      : { xs: 12, sm: 6, md: 4, lg: 3 };

  return (
    <div
      className={`pets-grid ${variant === "homepage" ? "homepage-5-cols" : ""}`}
    >
      {title && (
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">{title}</h3>
        </div>
      )}

      {displayPets.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              className="text-muted"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h4 className="text-muted mb-3">No pets found</h4>
          <p className="text-muted">
            {variant === "homepage"
              ? "Check back soon for more adorable pets looking for homes!"
              : "Try adjusting your search criteria to find more pets."}
          </p>
        </div>
      ) : (
        <>
          <Row className={variant === "homepage" ? "justify-content-center" : "g-4"}>
            {displayPets.map((pet) => (
              <Col
                key={pet.id}
                {...(variant === "homepage" ? {} : columnProps)}
                className={variant === "homepage" ? "col" : ""}
              >
                <PetCard
                  pet={pet}
                  className={
                    variant === "browse"
                      ? "browse-variant"
                      : variant === "homepage"
                      ? "homepage-variant"
                      : ""
                  }
                />
              </Col>
            ))}
          </Row>

          {/* Show "View More" button if there are more pets and it's enabled */}
          {showViewMoreButton && maxPets && pets.length > maxPets && (
            <div className="text-center mt-4">
              <LinkContainer to="/browse-pets">
                <Button variant="primary" size="lg" className="px-4">
                  View All {pets.length} Pets
                </Button>
              </LinkContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetsGrid;
