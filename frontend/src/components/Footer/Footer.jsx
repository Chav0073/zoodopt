import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeart,
  FaPaw,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <div className="footer-main">
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="g-4">
            {/* About Section */}
            <Col xs={12} sm={6} lg={3}>
              <div className="footer-section">
                <h5 className="footer-heading">
                  <FaPaw className="me-2" />
                  Zoodopt
                </h5>
                <p className="footer-text">
                  Connecting loving families with adorable pets in need of
                  forever homes. Every adoption saves a life and brings joy to
                  both pets and families.
                </p>
                <div className="footer-social">
                  <a href="#" className="social-link" aria-label="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={12} sm={6} lg={3}>
              <div className="footer-section">
                <h6 className="footer-subheading">Quick Links</h6>
                <ul className="footer-links">
                  <li>
                    <LinkContainer to="/">
                      <a href="/">Home</a>
                    </LinkContainer>
                  </li>
                  <li>
                    <LinkContainer to="/browse-pets">
                      <a href="/browse-pets">Browse Pets</a>
                    </LinkContainer>
                  </li>
                  <li>
                    <a href="#about">About Us</a>
                  </li>
                  <li>
                    <a href="#contact">Contact</a>
                  </li>
                  <li>
                    <a href="#help">Adoption Guide</a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* For Pet Lovers */}
            <Col xs={12} sm={6} lg={3}>
              <div className="footer-section">
                <h6 className="footer-subheading">For Pet Lovers</h6>
                <ul className="footer-links">
                  <li>
                    <a href="#care-tips">Pet Care Tips</a>
                  </li>
                  <li>
                    <a href="#training">Training Resources</a>
                  </li>
                  <li>
                    <a href="#health">Pet Health Guide</a>
                  </li>
                  <li>
                    <a href="#volunteer">Volunteer</a>
                  </li>
                  <li>
                    <a href="#donate">Donate</a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Contact Info */}
            <Col xs={12} sm={6} lg={3}>
              <div className="footer-section">
                <h6 className="footer-subheading">Get In Touch</h6>
                <div className="footer-contact">
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>123 Pet Street, Animal City, AC 12345</span>
                  </div>
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span>(555) 123-PETS</span>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <span>hello@zoodopt.com</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Container fluid style={{ maxWidth: "1600px" }}>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="text-center text-md-start">
              <p className="footer-copyright">
                © {currentYear} Zoodopt. Made with{" "}
                <FaHeart className="text-danger" /> for pets and their families.
              </p>
            </Col>
            <Col xs={12} md={6} className="text-center text-md-end">
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <span className="separator">•</span>
                <a href="#terms">Terms of Service</a>
                <span className="separator">•</span>
                <a href="#cookies">Cookie Policy</a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
