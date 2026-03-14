import { Link } from 'react-router-dom';
import "./Footer.css";

const EAC_FLAGS = ["ke", "ug", "tz", "rw", "bi", "ss", "cd", "so"];
const getFlagUrl = (code) => `https://flagcdn.com/w20/${code}.png`;

export default function Footer() {
    return (
        <footer className="footer">
            {/* EAC Unity Strip */}
            <div className="footer-authority">
                <div className="eac-flag-strip">
                    {EAC_FLAGS.map(code => (
                        <img key={code} src={getFlagUrl(code)} alt={code} className="mini-flag" />
                    ))}
                </div>
                <span>OFFICIAL EAC LABOR COMMUNITY GATEWAY</span>
                <div className="eac-flag-strip">
                    {EAC_FLAGS.reverse().map(code => (
                        <img key={code} src={getFlagUrl(code)} alt={code} className="mini-flag" />
                    ))}
                </div>
            </div>

            <div className="footer-inner">
                {/* About Section */}
                <div className="footer-section footer-about">
                    <div className="footer-logo">
                        <img src="https://www.eac.int/images/25_Anniversary_web_Banner_2.PNG" alt="EAC 25th Anniversary Official Emblem" className="footer-logo-img" />
                        <div className="logo-text">
                            <span className="logo-main">EAC LABOR</span>
                            <span className="logo-tag">Official Gateway</span>
                        </div>
                    </div>
                    <p>
                        A dedicated community platform facilitating secure and fair labor migration 
                        for workers across the East African Community. Empowering our talent 
                        with verified international opportunities.
                    </p>
                </div>

                {/* Navigation */}
                <div className="footer-section">
                    <h4>Community Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/jobs">Job Board</Link></li>
                        <li><Link to="/testimonials">Testimonials</Link></li>
                        <li><Link to="/checkstatus">Track Status</Link></li>
                    </ul>
                </div>

                {/* Standards */}
                <div className="footer-section">
                    <h4>Worker Support</h4>
                    <p className="contact-item"><strong>Inquiries:</strong> keinfoimmigration@yahoo.com</p>
                    <div className="secure-badge">
                        <span className="shield">🛡️</span>
                        <span>Official EAC Worker Protection</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <p>© 2026 East African Community. All Rights Reserved.</p>
                    <p className="compliance">Committed to Fair Recruiting and Worker Safety across Africa.</p>
                </div>
            </div>
        </footer>
    );
}
