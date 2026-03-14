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
        <div className="jobs-page-modern">
            {/* Premium Hero Section */}
            <header className="jobs-hero-modern">
                <div className="jobs-hero-bg-anim"></div>
                <div className="jobs-hero-content">
                    <div className="jobs-hero-badge">
                        <span className="pulse-dot"></span> EAC Global Employment Pool
                    </div>
                    <h1 className="jobs-hero-title">
                        Discover Your <span className="highlight-text">Future</span> Abroad
                    </h1>
                    <p className="jobs-hero-subtitle">
                        Access <strong>{ALL_JOBS.length}</strong> official, verified career opportunities across our bilateral partner nations. Premium placements with guaranteed portabillity.
                    </p>
                </div>
            </header>

            {/* Floating Glassmorphic Filter Bar */}
            <section className="jobs-filter-section">
                <div className="jobs-filter-glass">
                    <div className="filter-group-modern search-group">
                        <span className="filter-icon">🔍</span>
                        <input 
                            type="text" 
                            className="filter-input-modern"
                            placeholder="Search roles, sectors, or keywords..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="filter-divider"></div>
                    <div className="filter-group-modern select-group">
                        <span className="filter-icon">🌍</span>
                        <select 
                            className="filter-select-modern"
                            value={selectedCountry} 
                            onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                        >
                            {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'All Destinations' : c}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="jobs-results-meta">
                    Showing <strong>{filteredJobs.length}</strong> verified opportunities
                </div>
            </section>

            {/* Main Job Grid */}
            <section className="jobs-grid-section">
                {filteredJobs.length === 0 ? (
                     <div className="no-jobs-found">
                         <span className="no-jobs-icon">📭</span>
                         <h3>No matching opportunities found</h3>
                         <p>Adjust your search criteria or explore all destinations.</p>
                         <button className="reset-search-btn" onClick={() => { setSearchTerm(''); setSelectedCountry('All'); }}>
                             View All Jobs
                         </button>
                     </div>
                ) : (
                    <div className="modern-jobs-grid">
                        {currentJobs.map((job) => (
                            <div key={job.id} className="modern-job-card">
                                {/* Card Header Image Area */}
                                <div className="modern-card-header">
                                    <img src={job.image} alt={job.title} className="modern-hero-img" loading="lazy" />
                                    <div className="modern-card-overlay"></div>
                                    <div className="modern-sector-badge">{job.type}</div>
                                    <div className="modern-location-badge">
                                        <img src={getFlagUrl(job.flag)} alt={job.location} className="modern-flag" />
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                                
                                {/* Card Body */}
                                <div className="modern-card-body">
                                    <div className="modern-ref-bar">
                                        <span className="modern-ref-id">REF: {job.refId}</span>
                                        <span className="modern-company">🏛️ {job.company}</span>
                                    </div>
                                    
                                    <h3 className="modern-job-title" title={job.title}>{job.title}</h3>
                                    
                                    {/* Quick Specs inline */}
                                    <div className="modern-specs-row">
                                        <div className="modern-spec">
                                            <span className="spec-icn">⏱️</span> {job.processingTime} processing
                                        </div>
                                        <div className="modern-spec">
                                            <span className="spec-icn">📜</span> {job.contractDuration}
                                        </div>
                                        <div className="modern-spec">
                                            <span className="spec-icn">🏠</span> Housing Verified
                                        </div>
                                    </div>

                                    <p className="modern-job-excerpt">{job.description}</p>
                                    
                                    <div className="modern-verification-box">
                                        <div><span className="check-icon">✓</span> Official Bilateral Agreement</div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="modern-card-footer">
                                    <div className="modern-salary-box">
                                        <span className="salary-lbl">Est. Monthly Pay</span>
                                        <span className="salary-val">${job.salary.toLocaleString()}</span>
                                    </div>
                                    
                                    <Link 
                                        to="/jobdetail" 
                                        state={{ selectedJob: job }}
                                        className="modern-apply-btn"
                                    >
                                        Apply Now <span className="btn-arrow">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="modern-pagination">
                        <button 
                            className="modern-page-btn" 
                            onClick={handlePrev} 
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>
                        <div className="modern-page-info">
                            Page <span>{currentPage}</span> of {totalPages}
                        </div>
                        <button 
                            className="modern-page-btn" 
                            onClick={handleNext} 
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
