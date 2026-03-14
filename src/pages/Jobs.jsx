import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { generateJobs } from '../utils/jobData';
import './Jobs.css';

const ALL_JOBS = generateJobs();

const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

export default function Jobs() {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 12;

    useEffect(() => {
        const countryFromUrl = searchParams.get('country');
        if (countryFromUrl) {
            setSelectedCountry(countryFromUrl);
        } else {
            setSelectedCountry('All');
        }
    }, [searchParams]);

    const filteredJobs = useMemo(() => {
        return ALL_JOBS.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 job.type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = selectedCountry === 'All' || job.location === selectedCountry;
            return matchesSearch && matchesCountry;
        });
    }, [searchTerm, selectedCountry]);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const countries = ['All', ...new Set(ALL_JOBS.map(j => j.location))].sort();

    return (
        <div className="jobs-page">
            <header className="page-header">
                <div className="container">
                    <span className="header-tag">Live EAC Migration Pool</span>
                    <h1>Global Employment <span className="text-highlight">Marketplace</span></h1>
                    <p>Access <strong>{ALL_JOBS.length}</strong> verified opportunities across top bilateral partner countries.</p>
                </div>
            </header>

            <section className="marketplace-filters">
                <div className="filter-container">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search by role or sector (e.g. Healthcare)..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="country-filter">
                        <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}>
                            {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'All Partner Countries' : c}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            <section className="marketplace-section">
                <div className="marketplace-meta">
                    <p>Showing <strong>{filteredJobs.length}</strong> opportunities matching your criteria</p>
                </div>

                <div className="jobs-grid">
                    {currentJobs.map((job) => (
                        <div key={job.id} className="professional-job-card">
                            <div className="card-hero">
                                <img src={job.image} alt={job.title} className="hero-img" loading="lazy" />
                                <div className="job-category-shelf">{job.type}</div>
                                <div className="location-overlay">
                                    <img src={getFlagUrl(job.flag)} alt={job.location} />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            
                            <div className="card-content">
                                <div className="ref-strip">
                                    <span className="ref-id">{job.refId}</span>
                                    <span className="agreement-badge">{job.agreement}</span>
                                </div>
                                <div className="company-tag">{job.company}</div>
                                <h3 className="job-title">{job.title}</h3>
                                
                                <div className="metadata-specs">
                                    <div className="spec-item">
                                        <span className="spec-label">Processing</span>
                                        <span className="spec-value">{job.processingTime}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Contract</span>
                                        <span className="spec-value">{job.contractDuration}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Housing</span>
                                        <span className="spec-value">Verified</span>
                                    </div>
                                </div>

                                <div className="job-overview">
                                    <span className="overview-label">Official Job Overview</span>
                                    <p className="job-excerpt">{job.description}</p>
                                </div>
                                
                                <div className="verification-pact">
                                    <span className="v-check">✓ Verified by EAC Labor Ministry</span>
                                    <span className="v-check">✓ Portability Guaranteed</span>
                                </div>

                                <div className="card-footer">
                                    <div className="salary-block">
                                        <span className="s-label">Institutional Monthly Pay</span>
                                        <span className="s-value">${job.salary.toLocaleString()}</span>
                                    </div>
                                    <Link 
                                        to="/jobdetail" 
                                        state={{ selectedJob: job }}
                                        className="pro-apply-btn"
                                    >
                                        Begin Application
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pro-pagination">
                        <button onClick={handlePrev} disabled={currentPage === 1} className="p-btn">Previous</button>
                        <span className="p-info">Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="p-btn">Next</button>
                    </div>
                )}
            </section>
        </div>
    );
}
