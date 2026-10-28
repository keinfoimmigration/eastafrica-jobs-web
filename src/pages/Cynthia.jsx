import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { supabase } from "../utils/supabaseClient";
import "./Cynthia.css";

export default function Cynthia() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [processing, setProcessing] = useState({});

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            // 1. Direct fetch from Supabase (works in all environments)
            const { data, error } = await supabase
                .from('eacapplications')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setApplicants(data);
                return;
            }

            // 2. Fallback to API endpoint if direct Supabase client fails
            const response = await fetch("/api/get-applicants");
            const contentType = response.headers.get("content-type") || "";

            if (!response.ok || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(error?.message || `Server error (${response.status}): ${text.slice(0, 100)}`);
            }

            const apiData = await response.json();
            setApplicants(apiData);
        } catch (error) {
            console.error("Error loading applicants:", error);
            Swal.fire({
                title: "Load Failed",
                text: error.message || "Failed to load applicants",
                icon: "error",
                confirmButtonColor: "#003366"
            });
        } finally {
            setLoading(false);
        }
    };

    const sendInitialVerificationEmail = async (app) => {
        if (processing[app.application_number]) return;

        const result = await Swal.fire({
            title: "Send Verification Email?",
            text: `This will notify ${app.email} that they have passed initial verification and provide next steps.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Send Email",
            confirmButtonColor: "#003366",
            cancelButtonColor: "#d33"
        });

        if (!result.isConfirmed) return;

        setProcessing(prev => ({ ...prev, [app.application_number]: true }));

        try {
            const response = await fetch("/api/send-initial-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: app.email, 
                    applicationNumber: app.application_number,
                    phone: app.phone,
                    jobSubcategory: app.job_subcategory,
                    jobSector: app.job_sector,
                    destinationCountry: app.destination_country
                })
            });

            if (response.ok) {
                Swal.fire("Success!", "Initial verification email sent successfully.", "success");
                // Update local state immediately for a snappier UI
                setApplicants(prev => prev.map(a => 
                    a.application_number === app.application_number 
                        ? { ...a, status: 'Verified' } 
                        : a
                ));
                fetchApplicants(); // Still re-fetch to ensure sync with DB
            } else {
                let errorMsg = "Failed to send email";
                try {
                    const data = await response.json();
                    errorMsg = data.error || data.details || errorMsg;
                } catch {
                    const text = await response.text();
                    errorMsg = text ? `Server error: ${text.slice(0, 120)}` : `Server error (${response.status})`;
                }
                throw new Error(errorMsg);
            }
        } catch (error) {
            Swal.fire("Failed", error.message, "error");
        } finally {
            setProcessing(prev => ({ ...prev, [app.application_number]: false }));
        }
    };

    const sendOfferLetter = async (app) => {
        if (processing[app.application_number]) return;

        const result = await Swal.fire({
            title: "Send Official Offer Letter?",
            text: `This will generate a secure PDF offer letter for ${app.email} including QR code and official stamps.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Generate & Send PDF",
            confirmButtonColor: "#003366",
            cancelButtonColor: "#d33"
        });

        if (!result.isConfirmed) return;

        setProcessing(prev => ({ ...prev, [app.application_number]: true }));

        try {
            const response = await fetch("/api/send-offer-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: app.email, 
                    applicationNumber: app.application_number,
                    full_name: app.full_name || "Applicant",
                    jobSubcategory: app.job_subcategory,
                    jobSector: app.job_sector,
                    destinationCountry: app.destination_country
                })
            });

            if (response.ok) {
                Swal.fire("Sent!", "The official job offer letter (PDF) has been sent successfully.", "success");
                fetchApplicants();
            } else {
                let errorMsg = "Failed to send offer letter";
                try {
                    const data = await response.json();
                    errorMsg = data.error || data.details || errorMsg;
                } catch {
                    const text = await response.text();
                    errorMsg = text ? `Server error: ${text.slice(0, 120)}` : `Server error (${response.status})`;
                }
                throw new Error(errorMsg);
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setProcessing(prev => ({ ...prev, [app.application_number]: false }));
        }
    };

    const filteredApplicants = applicants
        .filter(app => {
            const safeSearch = (searchTerm || "").toLowerCase();
            return (
                (app.application_number || "").toLowerCase().includes(safeSearch) ||
                (app.phone || "").includes(safeSearch) ||
                (app.email || "").toLowerCase().includes(safeSearch) ||
                (app.origin_country || "").toLowerCase().includes(safeSearch) ||
                (app.destination_country || "").toLowerCase().includes(safeSearch) ||
                (app.job_sector || "").toLowerCase().includes(safeSearch)
            );
        })
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-content">
                    <h1>Cynthia's Dashboard</h1>
                    <p>Verification & Communication Portal</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search applicant..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Applications</h3>
                    <p className="stat-number">{applicants.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Verification</h3>
                    <p className="stat-number">
                        {applicants.filter(a => a.status !== 'Verified').length}
                    </p>
                </div>
                <div className="stat-card verified-card">
                    <h3>Verified Candidates</h3>
                    <p className="stat-number">
                        {applicants.filter(a => a.status === 'Verified').length}
                    </p>
                </div>
            </div>

            <div className="applicant-list-card">
                <h2>Applicant List</h2>
                {loading ? (
                    <div className="loading-spinner">Loading applicants...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ref No.</th>
                                    <th>Applicant Info</th>
                                    <th>Pathway</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map((app) => (
                                    <tr key={app.application_number}>
                                        <td className="ref-no">{app.application_number}</td>
                                        <td>
                                            <div className="contact-info">
                                                <span className="email">{app.email}</span>
                                                <span className="phone">{app.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="pathway-info">
                                                <span className="route">{app.origin_country} ➔ {app.destination_country}</span>
                                                <span className="sector">{app.job_sector}</span>
                                            </div>
                                        </td>
                                        <td>{formatDate(app.created_at)}</td>
                                        <td>
                                            <span className={`status-badge ${(app.status || "pending").toLowerCase().replace(/\s+/g, '-')}`}>
                                                {app.status || "Pending Review"}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons-group">
                                                <button 
                                                    className="verify-btn"
                                                    onClick={() => sendInitialVerificationEmail(app)}
                                                    disabled={processing[app.application_number] || app.status === 'Verified' || app.status === 'Offer Letter Sent'}
                                                >
                                                    {processing[app.application_number] ? "Sending..." : (app.status === 'Verified' || app.status === 'Offer Letter Sent' ? "Verified" : "Notify Verification")}
                                                </button>
                                                
                                                <button 
                                                    className="offer-btn"
                                                    onClick={() => sendOfferLetter(app)}
                                                    disabled={processing[app.application_number] || app.status === 'Pending Review' || (app.status !== 'Verified' && app.status !== 'Offer Letter Sent')}
                                                >
                                                    {processing[app.application_number] ? "Wait..." : (app.status === 'Offer Letter Sent' ? "Letter Resend" : "Send Offer Letter")}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApplicants.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-state">No applicants found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
