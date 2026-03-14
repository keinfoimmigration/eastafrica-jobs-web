import { Link } from 'react-router-dom';
import './Home.css';

const GLOBAL_DESTINATIONS = [
    {
        name: "USA",
        role: "Agriculture & Truck Driving",
        count: "150+ Openings",
        img: "https://images.unsplash.com/photo-1595066113158-96359f13735e?w=800&h=1000&fit=crop",
        flag: "us"
    },
    {
        name: "Australia",
        role: "Construction & Plumbing",
        count: "85+ Openings",
        img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=1000&fit=crop",
        flag: "au"
    },
    {
        name: "Qatar",
        role: "Janitorial & Security",
        count: "300+ Openings",
        img: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&h=1000&fit=crop",
        flag: "qa"
    },
    {
        name: "Saudi Arabia",
        role: "Janitorial & Watchmen",
        count: "200+ Openings",
        img: "https://images.unsplash.com/photo-1581578731522-745d0514227e?w=800&h=1000&fit=crop",
        flag: "sa"
    },
    {
        name: "Germany",
        role: "Janitorial & Logistics",
        count: "120+ Openings",
        img: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
        flag: "de"
    },
    {
        name: "Canada",
        role: "Agriculture & Sewer Ops",
        count: "110+ Openings",
        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=1000&fit=crop",
        flag: "ca"
    },
    {
        name: "UAE (Dubai)",
        role: "Fumigation & Waste Mgmt",
        count: "250+ Openings",
        img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
        flag: "ae"
    },
    {
        name: "UK",
        role: "Elderly Care & Housekeeping",
        count: "95+ Openings",
        img: "https://images.unsplash.com/photo-1581578731522-745d0514227e?w=800&h=1000&fit=crop",
        flag: "gb"
    },
    {
        name: "Poland",
        role: "Waste Mgmt & Housekeeping",
        count: "140+ Openings",
        img: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&h=1000&fit=crop",
        flag: "pl"
    }
];

const getFlagUrl = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

export default function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        OFFICIAL EAST AFRICAN COMMUNITY
                    </div>
                    <h1 className="portal-heading">Professional Labor<br /><span className="text-highlight">Gateway to the World</span></h1>
                    <p className="hero-description">The official community pathway connecting East African workers with verified general and technical opportunities. Your secure bridge to global employment markets.</p>
                    <div className="hero-cta">
                        <Link to="/jobs" className="cta-button primary">Browse Opportunities</Link>
                        <Link to="/jobdetail" className="cta-button secondary">Apply Now</Link>
                    </div>
                </div>
                <div className="hero-background">
                    <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000" alt="Happy People Working Abroad" />
                    <div className="hero-gradient"></div>
                </div>
            </header>

            {/* Global Destinations */}
            <section className="global-dest">
                <div className="section-header">
                    <span className="section-tag">Explore Opportunities</span>
                    <h2>Global Employment Destinations</h2>
                    <p>Verified positions for specialized and general workers with full community support and bilateral protection.</p>
                </div>
                <div className="destinations-grid">
                    {GLOBAL_DESTINATIONS.map(dest => (
                        <Link to={`/jobs?country=${dest.name}`} key={dest.name} className="destination-card">
                            <div className="card-image">
                                <img src={dest.img} alt={dest.name} />
                            </div>
                            <div className="dest-overlay">
                                <div className="dest-info">
                                    <div className="dest-header">
                                        <img src={getFlagUrl(dest.flag)} alt={dest.name} className="dest-flag" referrerPolicy="no-referrer" />
                                        <h3 className="dest-name">{dest.name}</h3>
                                    </div>
                                    <p className="dest-role">{dest.role}</p>
                                    <span className="dest-count">{dest.count}</span>
                                </div>
                                <div className="card-cta">
                                    Browse Jobs →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* EAC Trust Section */}
            <section className="trust-features">
                <div className="section-header">
                    <span className="section-tag">Secure Framework</span>
                    <h2>A Trusted Community Bridge</h2>
                </div>
                <div className="feature-grid">
                    <div className="trust-card">
                        <div className="trust-icon">🤝</div>
                        <h3>Community Verification</h3>
                        <p>All roles are vetted through official East African Community standards to ensure worker safety abroad.</p>
                    </div>
                    <div className="trust-card">
                        <div className="trust-icon">📜</div>
                        <h3>Bilateral Agreements</h3>
                        <p>Work with peace of mind. Every placement is backed by legal frameworks between the EAC and partner nations.</p>
                    </div>
                    <div className="trust-card">
                        <div className="trust-icon">🏠</div>
                        <h3>Full Protection</h3>
                        <p>Employers are required to provide housing, medical insurance, and fair wages for all verified EAC applicants.</p>
                    </div>
                </div>
            </section>

            {/* The Official Pathway (How it Works) */}
            <section className="how-it-works">
                <div className="section-header">
                    <span className="section-tag">Step-by-Step</span>
                    <h2>The Official Pathway</h2>
                </div>
                <div className="pathway-grid">
                    <div className="pathway-step">
                        <div className="step-num">01</div>
                        <h3>Registration & Profiling</h3>
                        <p>Securely submit your credentials through the official portal to begin your verification process.</p>
                    </div>
                    <div className="pathway-step">
                        <div className="step-num">02</div>
                        <h3>Skill Verification</h3>
                        <p>EAC labor experts validate your skills and certifications against international standards.</p>
                    </div>
                    <div className="pathway-step">
                        <div className="step-num">03</div>
                        <h3>Bilateral Matchmaking</h3>
                        <p>Your profile is matched with verified employers under official government-to-government agreements.</p>
                    </div>
                    <div className="pathway-step">
                        <div className="step-num">04</div>
                        <h3>Secure Deployment</h3>
                        <p>Receive your official EAC labor certificate and safely begin your international career.</p>
                    </div>
                </div>
            </section>

            {/* Community Impact (Statistics) */}
            <section className="impact-stats">
                <div className="stats-container">
                    <div className="stat-box">
                        <span className="stat-large">48,500+</span>
                        <p>Placed Workers</p>
                    </div>
                    <div className="stat-box">
                        <span className="stat-large">12</span>
                        <p>Bilateral Pacts</p>
                    </div>
                    <div className="stat-box">
                        <span className="stat-large">850+</span>
                        <p>Verified Employers</p>
                    </div>
                    <div className="stat-box">
                        <span className="stat-large">100%</span>
                        <p>Official Protection</p>
                    </div>
                </div>
            </section>

            {/* Governance & Partners */}
            <section className="governance-partners">
                <div className="section-header">
                    <span className="section-tag">Governance & Oversight</span>
                    <h2>Our Institutional Partners</h2>
                    <p>Operating under the supervision of EAC Member State Labor Ministries and international bodies.</p>
                </div>
                <div className="partners-flex">
                    <div className="partner-item">EAC SECRETARIAT</div>
                    <div className="partner-item">IOM - UN MIGRATION</div>
                    <div className="partner-item">ILO STANDARDS</div>
                    <div className="partner-item">MEMBER STATE MINISTRIES</div>
                </div>
            </section>

        </div>
    );
}