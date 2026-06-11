import { NavLink } from 'react-router-dom'
import Logo from '../assets/Logo.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <img src={Logo} alt="IET College" />
              <span className="footer-brand-name">IET College</span>
            </div>
            <p className="footer-about">
              Institute of Engineering & Technology — shaping future engineers
              and innovators with world-class education since 1998.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/admission">Admissions</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              <li><NavLink to="/login">Student Portal</NavLink></li>
              <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
            </ul>
          </div>

          {/* Academics */}
          <div className="footer-col">
            <h4>Academics</h4>
            <ul>
              <li><a href="#">B.Tech Programs</a></li>
              <li><a href="#">M.Tech Programs</a></li>
              <li><NavLink to="/admission">Admissions</NavLink></li>
              <li><a href="#">Examinations</a></li>
              <li><a href="#">Research</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="mailto:info@ietcollge.com">info@ietcollge.com</a></li>
              <li><a href="tel:+910000000000">+91 0000 0000</a></li>
              <li><a href="#">IET Campus, Main Road</a></li>
              <li><a href="#">City - 000000</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} IET College. All rights reserved.</span>
          <span>
            <NavLink to="/privacy" style={{ marginRight: 16 }}>Privacy Policy</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </span>
        </div>
      </div>
    </footer>
  )
}
