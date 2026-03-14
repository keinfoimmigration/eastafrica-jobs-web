import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "./CheckStatus.css";

const GERMAN_JOBS = [
  {
    category: "Information Technology",
    jobs: ["Frontend Developer", "Backend Developer", "Cloud Architect", "Cybersecurity Specialist", "DevOps Engineer"]
  },
  {
    category: "Engineering & Technical",
    jobs: ["Mechanical Design Engineer", "Electrical Systems Engineer", "Civil Infrastructure Engineer", "Automation & Robotics Specialist"]
  },
  {
    category: "Healthcare & Elderly Care",
    jobs: ["Geriatric Care Specialist", "Physical Therapist", "Senior Care Assistant", "Home Care Coordinator", "Clinical Support Worker"]
  },
  {
    category: "Manufacturing & Logistics",
    jobs: ["CNC Precision Operator", "Warehouse Operations Manager", "Quality Assurance Inspector", "Industrial Assembly Technician"]
  }
];

export default function CheckStatus() {
  useEffect(() => { document.title = "Track Application – East African Community"; }, []);

  const [searchInput, setSearchInput] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubJob, setSelectedSubJob] = useState("");
  const [jobRemarks, setJobRemarks] = useState("");
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  const checkStatus = async () => {
    if (!searchInput.trim()) return setError("Please enter your Application Number or Mobile Number.");
    setLoading(true);
    setError("");
    setApplication(null);
    setSuccessMessage("");

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .or(`application_number.eq.${searchInput},phone.eq.${searchInput}`)
      .single();

    if (error) setError(`No application found. Please check your details and try again.`);
    else if (!data) setError("No application found with that reference.");
    else setApplication(data);

    setLoading(false);
  };

  const verifyPayment = async () => {
    if (!mpesaCode.trim()) return setModalError("Please enter the M-Pesa transaction code.");
    setModalError("");
    setModalSuccess("");

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("application_number", application.application_number)
      .eq("mpesa_code", mpesaCode)
      .single();

    if (error || !data) {
      setModalError("Payment not found. Please check your M-Pesa code.");
      setPaymentVerified(false);
    } else {
      setPaymentVerified(true);
      setModalSuccess("Payment verified successfully ✅");
    }
  };

  const submitInterviewBooking = async () => {
    if (!paymentVerified) return setModalError("Please verify your payment first.");
    if (!interviewDate || !interviewTime) return setModalError("Please select an interview date and time.");

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("application_number", application.application_number)
      .eq("mpesa_code", mpesaCode)
      .single();

    if (paymentError || !paymentData) {
      setModalError("Payment re-verification failed. Cannot submit.");
      setPaymentVerified(false);
      return;
    }

    const { error } = await supabase
      .from("applications")
      .update({
        interview_date: interviewDate,
        interview_time: interviewTime,
        status: "Interview Confirmed",
        mpesa_code: mpesaCode,
      })
      .eq("application_number", application.application_number);

    if (error) setModalError("Failed to save interview. Please try again.");
    else {
      setApplication({ ...application, status: "Interview Confirmed", interview_date: interviewDate, interview_time: interviewTime });
      setShowModal(false);
      setSuccessMessage(`✅ Interview booked for ${interviewDate} at ${interviewTime}`);
      setTimeout(() => setSuccessMessage(""), 5000);
      setPaymentVerified(false);
      setMpesaCode("");
      setInterviewDate("");
      setInterviewTime("");
      setModalError("");
      setModalSuccess("");
    }
  };

  const submitJobSelection = async () => {
    if (!selectedCategory || !selectedSubJob) return setModalError("Please select both a job category and a specific role.");
    
    setIsSubmittingJob(true);
    setModalError("");
    
    const { error } = await supabase
      .from("applications")
      .update({
        job_sector: selectedCategory,
        job_subcategory: selectedSubJob,
        remarks: jobRemarks,
        is_job_selected: 1
      })
      .eq("application_number", application.application_number);

    if (error) {
      setModalError("Failed to save selection. Please try again.");
    } else {
      setApplication({ 
        ...application, 
        job_sector: selectedCategory, 
        job_subcategory: selectedSubJob, 
        remarks: jobRemarks,
        is_job_selected: 1 
      });
      setShowJobModal(false);
      setSuccessMessage("✅ Job selection submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    setIsSubmittingJob(false);
  };

  const resetModal = () => {
    setShowModal(false);
    setPaymentVerified(false);
    setMpesaCode("");
    setInterviewDate("");
    setInterviewTime("");
    setModalError("");
    setModalSuccess("");
  };

  const getStatusInfo = (status) => {
    const map = {
      "Submitted": { cls: "badge-submitted", icon: "📋", label: "Application Received", step: 1 },
      "Pending Review": { cls: "badge-pending", icon: "⏳", label: "Awaiting Verification", step: 1 },
      "Under Review": { cls: "badge-review", icon: "🔍", label: "Document Verification", step: 2 },
      "Interview Scheduled": { cls: "badge-interview", icon: "📅", label: "Interview Required", step: 3 },
      "Interview Confirmed": { cls: "badge-approved", icon: "✅", label: "Interview Booked", step: 4 },
      "Approved": { cls: "badge-approved", icon: "🎉", label: "Final Approval", step: 5 },
      "Rejected": { cls: "badge-rejected", icon: "❌", label: "Notice of Refusal", step: 5 },
      "On Hold": { cls: "badge-onhold", icon: "⏸️", label: "Pending Additional Info", step: 2 },
    };
    return map[status] || { cls: "badge-other", icon: "ℹ️", label: status, step: 0 };
  };

  const statusInfo = application ? getStatusInfo(application.status) : null;

  return (
    <div className="cs-page">
      {/* Toast */}
      {successMessage && (
        <div className="cs-toast">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <header className="cs-hero">
        <div className="cs-hero-badge">
          <span className="cs-flag">🇪🇦</span> Official Tracking System
        </div>
        <h1 className="cs-hero-title">Application Status</h1>
        <p className="cs-hero-sub">
          Access real-time updates and secure management of your international
          migration application within the EAC Global Employment network.
        </p>
        <div className="cs-system-status">
          <span className="cs-pulse-dot"></span> Live Network Sync Verified
        </div>
      </header>

      <div className="cs-container">
        {/* Search Card */}
        <div className="cs-search-card">
          <div className="cs-search-inner">
            <div className="cs-input-wrap">
              <span className="cs-input-icon">🔎</span>
              <input
                id="searchInput"
                type="text"
                className="cs-input"
                placeholder="Enter Application Ref (EAC-XXX) or Mobile"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkStatus()}
              />
            </div>
            <button className="cs-primary-btn" onClick={checkStatus} disabled={loading}>
              {loading ? (
                <span className="cs-spinner"></span>
              ) : (
                <><span>Check Status</span><span className="cs-btn-arrow">→</span></>
              )}
            </button>
          </div>
          {error && (
            <div className="cs-error-box">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* Result Card */}
        {application && (
          <div className="cs-result-card">
            {/* Status Banner */}
            <div className={`cs-status-banner ${statusInfo.cls}`}>
              <span className="cs-status-icon">{statusInfo.icon}</span>
              <div>
                <p className="cs-status-label">Application Status</p>
                <p className="cs-status-value">{statusInfo.label}</p>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="cs-progress-tracker">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`cs-step ${statusInfo.step >= s ? 'active' : ''} ${statusInfo.step > s ? 'completed' : ''}`}>
                  <div className="cs-step-circle">{statusInfo.step > s ? '✓' : s}</div>
                </div>
              ))}
            </div>

            {/* Application Details */}
            <div className="cs-details-grid">
              <div className="cs-detail-item">
                <span className="cs-detail-label">Reference Number</span>
                <span className="cs-detail-value cs-app-num">{application.application_number}</span>
              </div>
              <div className="cs-detail-item">
                <span className="cs-detail-label">Applicant Name</span>
                <span className="cs-detail-value">{application.full_name || "Record Updated"}</span>
              </div>
              <div className="cs-detail-item">
                <span className="cs-detail-label">Contact Email</span>
                <span className="cs-detail-value">{application.email}</span>
              </div>
              <div className="cs-detail-item">
                <span className="cs-detail-label">Mobile Number</span>
                <span className="cs-detail-value">{application.phone}</span>
              </div>
              <div className="cs-detail-item">
                <span className="cs-detail-label">Filing Date</span>
                <span className="cs-detail-value">
                  {new Date(application.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              {(application.interview_date || application.status === "Interview Scheduled") && (
                <div className="cs-detail-item">
                  <span className="cs-detail-label">Interview Status</span>
                  <span className="cs-detail-value cs-interview-highlight">
                    {application.interview_date ? `Scheduled: ${application.interview_date} @ ${application.interview_time}` : "Action Required Below"}
                  </span>
                </div>
              )}
              {application.is_job_selected === 1 && (
                <>
                  <div className="cs-detail-item">
                    <span className="cs-detail-label">Selected Sector</span>
                    <span className="cs-detail-value">{application.job_sector}</span>
                  </div>
                  <div className="cs-detail-item">
                    <span className="cs-detail-label">Designated Role</span>
                    <span className="cs-detail-value cs-interview-highlight">{application.job_subcategory}</span>
                  </div>
                </>
              )}
            </div>

            {/* Book Interview CTA */}
            {application.status === "Interview Scheduled" && (
              <div className="cs-cta-strip">
                <div>
                  <p className="cs-cta-title">📅 Action Required: Book Your Interview</p>
                  <p className="cs-cta-sub">Your application has reached the interview stage. Secure your slot now.</p>
                </div>
                <button className="cs-primary-btn" onClick={() => setShowModal(true)}>
                  Secure Slot →
                </button>
              </div>
            )}

            {/* Job Selection CTA */}
            {application.status === "Approved" && !application.is_job_selected && (
              <div className="cs-cta-strip cs-job-cta">
                <div>
                  <p className="cs-cta-title">🎯 Final Step: Select Your Deployment Role</p>
                  <p className="cs-cta-sub">Your application is approved. Please select your specific job role in Germany.</p>
                </div>
                <button className="cs-primary-btn" onClick={() => setShowJobModal(true)}>
                  Select Available Job →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Selection Modal */}
      {showJobModal && (
        <div className="cs-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowJobModal(false)}>
          <div className="cs-modal cs-job-modal">
            <button className="cs-modal-close" onClick={() => setShowJobModal(false)}>✕</button>
            <div className="cs-modal-header">
              <span className="cs-modal-icon">🇩🇪</span>
              <h3>Select Your Germany Job</h3>
            </div>

            <div className="cs-modal-section">
              <label className="cs-modal-label">Job Sector</label>
              <select 
                className="cs-modal-input"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubJob("");
                }}
              >
                <option value="">Select a Sector</option>
                {GERMAN_JOBS.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
            </div>

            <div className="cs-modal-section">
              <label className="cs-modal-label">Specific Role</label>
              <select 
                className="cs-modal-input"
                value={selectedSubJob}
                onChange={(e) => setSelectedSubJob(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select a Role</option>
                {selectedCategory && GERMAN_JOBS.find(c => c.category === selectedCategory)?.jobs.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>

            <div className="cs-modal-section">
              <label className="cs-modal-label cs-textarea-header">
                Additional Remarks 
                <span className={`cs-char-count ${jobRemarks.length >= 250 ? 'warning' : ''}`}>
                  {jobRemarks.length}/250
                </span>
              </label>
              <textarea 
                className="cs-modal-input cs-modal-textarea"
                placeholder="Add any specific requirements or notes (max 250 chars)..."
                value={jobRemarks}
                onChange={(e) => setJobRemarks(e.target.value.slice(0, 250))}
              />
            </div>

            {modalError && <p className="cs-modal-error">⚠️ {modalError}</p>}

            <div className="cs-modal-footer">
              <button className="cs-outline-btn" onClick={() => setShowJobModal(false)}>Cancel</button>
              <button 
                className="cs-primary-btn" 
                onClick={submitJobSelection} 
                disabled={isSubmittingJob || !selectedCategory || !selectedSubJob}
              >
                {isSubmittingJob ? <span className="cs-spinner"></span> : "Confirm Selection →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Booking Modal */}
      {showModal && (
        <div className="cs-modal-overlay" onClick={(e) => e.target === e.currentTarget && resetModal()}>
          <div className="cs-modal">
            <button className="cs-modal-close" onClick={resetModal}>✕</button>
            <div className="cs-modal-header">
              <span className="cs-modal-icon">🏛️</span>
              <h3>Secure Your Interview</h3>
            </div>

            <div className="cs-steps">
              <strong>Official Steps:</strong>
              <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                <li>Remit administrative fee (Ksh 1,000) to Till <strong>{4139224}</strong></li>
                <li>Verify your <strong>M-Pesa Trace Code</strong> below</li>
                <li>Select from available <strong>Interview Slots</strong></li>
              </ol>
            </div>

            {/* Payment Section */}
            <div className="cs-modal-section">
              <label className="cs-modal-label">Transaction Reference</label>
              <div className="cs-modal-input-row">
                <input
                  type="text"
                  className="cs-modal-input"
                  placeholder="e.g. RKS9X8LW3P"
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                  disabled={paymentVerified}
                />
                <button
                  className={`cs-verify-btn ${paymentVerified ? "cs-verify-done" : ""}`}
                  onClick={verifyPayment}
                  disabled={paymentVerified}
                >
                  {paymentVerified ? "Verified ✅" : "Verify Code"}
                </button>
              </div>
            </div>

            {/* Selector Section */}
            <div className="cs-modal-row2">
              <div className="cs-modal-section">
                <label className="cs-modal-label">Available Date</label>
                <input
                  type="date"
                  className="cs-modal-input"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  disabled={!paymentVerified}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="cs-modal-section">
                <label className="cs-modal-label">Available Time</label>
                <input
                  type="time"
                  className="cs-modal-input"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  disabled={!paymentVerified}
                />
              </div>
            </div>

            {modalError && <p className="cs-modal-error">⚠️ {modalError}</p>}
            {modalSuccess && <p className="cs-modal-success">{modalSuccess}</p>}

            <div className="cs-modal-footer">
              <button className="cs-outline-btn" onClick={resetModal}>Cancel</button>
              <button 
                className="cs-primary-btn" 
                onClick={submitInterviewBooking} 
                disabled={!paymentVerified || !interviewDate || !interviewTime}
              >
                Confirm Appointment →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}