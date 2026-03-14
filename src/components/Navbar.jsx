import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const EAC_FLAGS = [
    { code: "ke", name: "Kenya" },
    { code: "ug", name: "Uganda" },
    { code: "tz", name: "Tanzania" },
    { code: "rw", name: "Rwanda" },
    { code: "bi", name: "Burundi" },
    { code: "ss", name: "South Sudan" },
    { code: "cd", name: "DRC" },
    { code: "so", name: "Somalia" }
];

const getFlagUrl = (code) => `https://flagcdn.com/w40/${code}.png`;

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className={`navbar-header ${isScrolled ? 'is-scrolled' : ''}`}>
            {/* EAC Flag Ticker */}
            <div className="nav-ticker-strip">
                <div className="ticker-wrapper">
                    {EAC_FLAGS.map((flag, i) => (
                        <div key={i} className="ticker-item">
                            <img src={getFlagUrl(flag.code)} alt={flag.name} referrerPolicy="no-referrer" />
                        </div>
                    ))}
                    {EAC_FLAGS.map((flag, i) => (
                        <div key={`dup-${i}`} className="ticker-item">
                            <img src={getFlagUrl(flag.code)} alt={flag.name} referrerPolicy="no-referrer" />
                        </div>
                    ))}
                </div>
                <div className="verified-pulse">
                    <span className="pulse-dot"></span>
                    OFFICIAL EAST AFRICAN COMMUNITY
                </div>
            </div>

            <div className="nav-container">

                <Link to="/" className="nav-logo">
                    <img src="https://www.eac.int/images/25_Anniversary_web_Banner_2.PNG" alt="EAC 25th Anniversary Official Emblem" className="logo-img" />
                    <div className="logo-text">
                        <span className="logo-main">EAST AFRICAN COMMUNITY</span>
                        <span className="logo-tag">Official Community Gateway</span>
                    </div>
                </Link>

                <button 
                    className={`nav-toggle ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <NavLink to="/jobs" className="nav-link">Opportunities</NavLink>
                    <NavLink to="/testimonials" className="nav-link">Success Stories</NavLink>
                    <NavLink to="/checkstatus" className="nav-link">Track Status</NavLink>
                    <Link to="/jobdetail" className="nav-cta">Apply Now</Link>
                </nav>
            </div>
        </header>
    );
}