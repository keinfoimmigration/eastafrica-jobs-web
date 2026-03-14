import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./JobDetail.css";

export default function JobDetail() {
    useEffect(() => {
        document.title = "Official Application Portal | EAC Global Employment";
        window.scrollTo(0, 0);
    }, []);

    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({ 
        email: "", 
        phone: "", 
        countryCode: "+254",
        originCountry: "",
        destinationCountry: "",
        jobSector: "",
        jobSubcategory: ""
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    
    const EAC_COUNTRIES = [
        "Kenya", "Tanzania", "Uganda", "Rwanda", "Burundi", "South Sudan", "DRC", "Somalia"
    ];

    const GLOBAL_DESTINATIONS = [
        "Germany", "USA", "UK", "Canada", "Australia", "Qatar", "UAE (Dubai)", "Saudi Arabia", "Poland"
    ];

    const JOB_SECTORS = [
        "Essential Services", "Healthcare & Caregiving", "Construction & Logistics", 
        "Agriculture & Packaging", "Hospitality & Retail", "Manufacturing",
        "Information Technology", "Engineering & Technical", "Education & Training",
        "Public Administration", "Financial Services", "Professional Security"
    ];

    const JOB_SUBCATEGORIES = {
        "Essential Services": ["Facility Cleaning & Janitor", "Municipal Sewer Unblocker", "Garbage Collection Operative", "Facility Fumigation Assistant", "Street Sweeping Associate", "Public Park Maintenance Worker", "Recycling Plant Sorter", "Pest Control Specialist", "Window Cleaning Technician", "Car Wash Attendant"],
        "Healthcare & Caregiving": ["Elderly Care & Support Worker", "Certified Nursing Assistant", "Hospital Ward Assistant", "Home Health Aide", "Disability Support Worker", "Medical Orderly", "Clinical Cleaner", "Palliative Care Assistant", "Pharmacy Assistant", "Healthcare Logistics Driver"],
        "Construction & Logistics": ["Infrastructure Construction Helper", "Professional Heavy Truck Driver", "Heavy Machinery Operator", "Warehouse Forklift Driver", "Masonry Assistant", "Scaffolding Rigger", "Concrete Pouring Laborer", "Steel Fixing Assistant", "Supply Chain Handler", "Delivery Route Driver"],
        "Agriculture & Packaging": ["Institutional Farm Associate", "Landscape Gardener & Groundsman", "Greenhouse Harvesting Specialist", "Packaging Line Operative", "Livestock Care Assistant", "Dairy Farm Worker", "Fruit & Vegetable Picker", "Agricultural Machinery Operator", "Meat Processing Assistant", "Floriculture Worker"],
        "Hospitality & Retail": ["Professional Housekeeper", "Hotel Concierge Assistant", "Industrial Catering Staff", "Restaurant Waitstaff", "Kitchen Porter / Dishwasher", "Bartender & Mixologist", "Retail Sales Assistant", "Supermarket Cashier", "Store Room Attendant", "Event Setup Crew"],
        "Manufacturing": ["Assembly Line Worker", "Industrial Machine Operator", "Quality Control Assistant", "Textile & Garment Machinist", "Food Processing Worker", "Plastics Manufacturing Operative", "Metal Workshop Assistant", "Packaging & Labeling Staff", "Factory Maintenance Helper", "Print Room Bindery Worker"],
        "Information Technology": ["Senior Software Engineer", "Network Support Technician", "Data Entry Specialist", "IT Helpdesk Assistant", "Web Developer", "QA Tester / Software Validator", "Database Administrator", "System Administrator", "UI/UX Designer", "Technical Writer"],
        "Engineering & Technical": ["Mechanical Design Engineer", "Certified Maintenance Plumber", "Electrical Technician", "Welding Specialist", "HVAC Maintenance Technician", "Automotive Mechanic", "Civil Engineering Technician", "Carpentry & Joinery Specialist", "Machinist / Toolmaker", "Telecommunications Cable Jointer"],
        "Education & Training": ["Vocational Skills Instructor", "Early Childhood Education Assistant", "Special Education Aide", "School Administrator", "Language Tutor", "Library Assistant", "Physical Education Coach", "Student Welfare Officer"],
        "Public Administration": ["Administrative Clerk", "Records Management Assistant", "Customer Service Officer", "Data Archiving Specialist", "Receptionist / Telephone Operator", "Procurement Assistant", "Mail Room Coordinator", "Compliance Support Officer"],
        "Financial Services": ["Financial Analyst & Auditor", "Accounts Payable Clerk", "Payroll Assistant", "Teller / Cashier", "Insurance Claims Processor", "Credit Control Assistant", "Bookkeeper", "Financial Data Entry Clerk"],
        "Professional Security": ["Professional Facility Watchman", "Commercial Security Escort", "CCTV Monitoring Operator", "Event Security Guard", "Armored Vehicle Guard", "Retail Loss Prevention Officer", "Border / Port Security Assistant", "VIP Protection Officer"]
    };
    const countryFlags = {
        "+254": "🇰🇪",
        "+49": "🇩🇪",
        "+255": "🇹🇿",
        "+256": "🇺🇬",
        "+1": "🇺🇸",
        "+44": "🇬🇧"
    };

    useEffect(() => {
        if (formData.jobSector) {
            const availableSubs = JOB_SUBCATEGORIES[formData.jobSector] || ["General Worker"];
            setFormData(prev => ({ ...prev, jobSubcategory: availableSubs[0] }));
        } else {
            setFormData(prev => ({ ...prev, jobSubcategory: "" }));
        }
    }, [formData.jobSector]);

    const generateApplicationNumber = () => {
        const random = Math.floor(100000 + Math.random() * 900000);
        return `EAC-${new Date().getFullYear()}-${random}`;
    };

    const handleAnswer = (question, value) => {
        setAnswers(prev => ({ ...prev, [question]: value }));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const proceedToDocuments = () => {
        if (!formData.originCountry || !formData.destinationCountry || !formData.jobSector || !formData.jobSubcategory) {
            setError("Please select all migration pathway details.");
            return;
        }
        if (!answers.q1 || !answers.q2 || !answers.q3) {
            setError("All assessment questions must be answered.");
            return;
        }
        setError("");
        setCurrentStep(2);
    };

    const saveApplication = async () => {
        try {
            setSaving(true);
            setError("");

            const fullPhone = `${formData.countryCode}${formData.phone}`;

            // Check for existing email or phone
            const { data: existingApp, error: fetchError } = await supabase
                .from("EACapplications")
                .select("email, phone")
                .or(`email.eq.${formData.email},phone.eq.${fullPhone}`)
                .maybeSingle();

            if (fetchError) {
                console.error("Fetch error:", fetchError);
                setError("Verification failed. Please try again.");
                setSaving(false);
                return null;
            }

            if (existingApp) {
                let message = "";
                if (existingApp.email === formData.email && existingApp.phone === fullPhone) {
                    message = "An application with this email and phone number already exists.";
                } else if (existingApp.email === formData.email) {
                    message = "An application with this email address already exists.";
                } else {
                    message = "An application with this mobile number already exists.";
                }

                Swal.fire({
                    title: "Duplicate Application",
                    text: message,
                    icon: "warning",
                    confirmButtonColor: "#003366"
                });

                setSaving(false);
                return null;
            }

            const appNumber = generateApplicationNumber();

            const { error: insertError } = await supabase
                .from("EACapplications")
                .insert([
                    {
                        application_number: appNumber,
                        email: formData.email,
                        phone: fullPhone,
                        origin_country: formData.originCountry,
                        destination_country: formData.destinationCountry,
                        job_sector: formData.jobSector,
                        job_subcategory: formData.jobSubcategory,
                        experience: answers.q1,
                        relocate: answers.q2,
                        language: answers.q3,
                        status: "Pending Review"
                    }
                ]);

            if (insertError) {
                console.error(insertError);
                setError("Failed to save application. Please try again.");
                setSaving(false);
                return null;
            }

            setSaving(false);
            return appNumber;

        } catch (err) {
            console.error(err);
            setError("Unexpected error occurred.");
            setSaving(false);
            return null;
        }
    };

    const submitApplication = async () => {
        if (!formData.email || !formData.phone) {
            setError("Email address and mobile number are required.");
            return;
        }

        if (!files.idFront || !files.idBack || !files.passportPhoto) {
            setError("All required documents (ID Front, ID Back, and Passport Photo) must be uploaded.");
            return;
        }

        setError("");

        const appNumber = await saveApplication();

        if (appNumber) {
            // Send confirmation email
            try {
                const response = await fetch("/api/send-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        applicationNumber: appNumber
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("API Error Response:", errorData);
                }
            } catch (err) {
                console.error("Fetch Network Error:", err);
            }

            Swal.fire({
                title: "Application Submitted Successfully",
                html: `
                    <div style="text-align:left; font-size:14px;">
                        <p style="margin-bottom:10px;">
                            Your application has been successfully received and is currently under review.
                        </p>

                        <div style="
                            margin:15px 0;
                            padding:14px;
                            background:#f4f8fb;
                            border-radius:8px;
                            text-align:center;
                        ">
                            <div style="font-size:13px; color:#666;">
                                Application Number
                            </div>
                            <div style="
                                font-size:18px;
                                font-weight:bold;
                                color:#003366;
                                margin-top:5px;
                                word-break:break-word;
                            ">
                                ${appNumber}
                            </div>
                        </div>

                        <p style="margin-top:10px;">
                            Please keep this number safe. You can use it to check your application status.
                        </p>
                    </div>
                `,
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Check Status",
                confirmButtonColor: "#003366",
                cancelButtonColor: "#6c757d",
                width: "95%",
                maxWidth: "420px",
                padding: "1.5rem",
                didOpen: () => {
                    const popup = document.querySelector(".swal2-popup");
                    popup.style.borderRadius = "12px";
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/checkstatus";
                } else {
                    setCurrentStep(1);
                    setFormData({ email: "", phone: "" });
                    setAnswers({});
                    setFiles({});
                }
            });
        }
    };

    return (
        <div className="jd-page">
            {/* Hero Header */}
            <header className="jd-hero">
                <div className="jd-hero-badge">
                    <span className="jd-flag">🇪🇦</span> Official EAC Application Portal
                </div>
                <h1 className="jd-hero-title">Work Authorization & Migration</h1>
                <p className="jd-hero-sub">
                    Secure your international career through the official East African Community 
                    Global Employment program. Follow the steps below to begin your journey.
                </p>
            </header>

            <div className="jd-container">
                {/* Stepper */}
                <div className="jd-stepper-wrap">
                    <div className="jd-stepper">
                        <div className={`jd-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
                            <div className="jd-step-number">{currentStep > 1 ? "✓" : "1"}</div>
                            <span className="jd-step-label">Eligibility Assessment</span>
                        </div>
                        <div className="jd-step-connector"></div>
                        <div className={`jd-step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
                            <div className="jd-step-number">{currentStep > 2 ? "✓" : "2"}</div>
                            <span className="jd-step-label">Applicant Information</span>
                        </div>
                        <div className="jd-step-connector"></div>
                        <div className="jd-step">
                            <div className="jd-step-number">3</div>
                            <span className="jd-step-label">Final Review</span>
                        </div>
                    </div>
                </div>

                {currentStep === 1 && (
                    <section className="jd-form-card">
                        <div className="jd-card-header">
                            <span className="jd-card-icon">🎯</span>
                            <h3>Migration Pathway Selection</h3>
                        </div>

                        <div className="jd-form-grid">
                            <div className="jd-form-group">
                                <label>Country of Origin (EAC) *</label>
                                <select name="originCountry" value={formData.originCountry} onChange={handleInputChange}>
                                    <option value="">Select Country</option>
                                    {EAC_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="jd-form-group">
                                <label>Target Work Destination *</label>
                                <select name="destinationCountry" value={formData.destinationCountry} onChange={handleInputChange}>
                                    <option value="">Select Destination</option>
                                    {GLOBAL_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="jd-form-group">
                                <label>Specialized Work Sector *</label>
                                <select name="jobSector" value={formData.jobSector} onChange={handleInputChange}>
                                    <option value="">Select Sector</option>
                                    {JOB_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="jd-form-group">
                                <label>Specifically Assigned Role *</label>
                                <select name="jobSubcategory" value={formData.jobSubcategory} onChange={handleInputChange}>
                                    <option value="">Select Role</option>
                                    {(JOB_SUBCATEGORIES[formData.jobSector] || []).map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="jd-divider"></div>

                        <div className="jd-card-header">
                            <span className="jd-card-icon">📋</span>
                            <h3>Mandatory Eligibility Check</h3>
                        </div>

                        <div className="jd-qa-list">
                            <div className="jd-qa-item">
                                <label>Do you have at least 2 years of verifiable professional experience within the East African Community (EAC)? *</label>
                                <div className="jd-select-wrap">
                                    <select onChange={(e) => handleAnswer("q1", e.target.value)}>
                                        <option value="">Select Response</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="jd-qa-item">
                                <label>Are you prepared to relocate internationally immediately upon the successful issuance of a Work Visa? *</label>
                                <div className="jd-select-wrap">
                                    <select onChange={(e) => handleAnswer("q2", e.target.value)}>
                                        <option value="">Select Response</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="jd-qa-item">
                                <label>Do you possess professional working proficiency in English or the primary language of your destination country? *</label>
                                <div className="jd-select-wrap">
                                    <select onChange={(e) => handleAnswer("q3", e.target.value)}>
                                        <option value="">Select Response</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="jd-footer-actions">
                            <button className="jd-primary-btn" onClick={proceedToDocuments}>
                                Continue to Information <span className="jd-btn-arrow">→</span>
                            </button>
                        </div>
                    </section>
                )}

                {currentStep === 2 && (
                    <section className="jd-form-card">
                        <div className="jd-card-header">
                            <span className="jd-card-icon">👤</span>
                            <h3>Applicant Contact Details</h3>
                        </div>

                        <div className="jd-form-grid">
                            <div className="jd-form-group">
                                <label>Official Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="yourname@official.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="jd-form-group">
                                <label>Verified Mobile Number *</label>
                                <div className="jd-phone-group">
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleInputChange}
                                        className="jd-country-code"
                                    >
                                        {Object.entries(countryFlags).map(([code, flag]) => (
                                            <option key={code} value={code}>
                                                {flag} {code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="712 345 678"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="jd-divider"></div>

                        <div className="jd-card-header">
                            <span className="jd-card-icon">📂</span>
                            <h3>Required Documentation (Official Copy)</h3>
                        </div>

                        <div className="jd-upload-grid">
                            <div className="jd-upload-item">
                                <label>National ID / Passport (Front) *</label>
                                <div className="jd-file-input-wrap">
                                    <input type="file" name="idFront" onChange={handleFileChange} />
                                    <span className="jd-upload-hint">{files.idFront ? "✅ File Loaded" : "Upload Document"}</span>
                                </div>
                            </div>

                            <div className="jd-upload-item">
                                <label>National ID / Passport (Back) *</label>
                                <div className="jd-file-input-wrap">
                                    <input type="file" name="idBack" onChange={handleFileChange} />
                                    <span className="jd-upload-hint">{files.idBack ? "✅ File Loaded" : "Upload Document"}</span>
                                </div>
                            </div>

                            <div className="jd-upload-item">
                                <label>Official Passport Photo *</label>
                                <div className="jd-file-input-wrap">
                                    <input type="file" name="passportPhoto" onChange={handleFileChange} />
                                    <span className="jd-upload-hint">{files.passportPhoto ? "✅ File Loaded" : "Upload Photo"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="jd-footer-actions">
                            <button className="jd-secondary-btn" onClick={() => setCurrentStep(1)}>
                                Back
                            </button>
                            <button
                                className="jd-primary-btn"
                                onClick={submitApplication}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="jd-spinner"></span>
                                        <span>Processing Submission...</span>
                                    </>
                                ) : (
                                    "Complete Official Submission"
                                )}
                            </button>
                        </div>
                    </section>
                )}

                {error && (
                    <div className="jd-error-box">
                        <span className="jd-error-icon">⚠️</span>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}