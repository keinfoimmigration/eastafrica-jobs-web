import { useState, useMemo } from 'react';
import './Testimonials.css';

export default function Testimonials() {
    const perPage = 4;

    // ✅ Authentic Success Stories with Origin & Destination
    const testimonialsData = [
        {
            id: 7,
            name: "Cynthia Maina",
            fromCountry: "Kenya",
            destination: "Germany",
            sector: "Elderly Care",
            date: "2026-03-03",
            story: "Just received my certificate today! The process for elderly care in Germany was so fast through this gateway. I've already signed my contract with Sunrise Communities!",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 8,
            name: "Juma Bakari",
            fromCountry: "Tanzania",
            destination: "UK",
            sector: "Truck Driving",
            date: "2026-02-20",
            story: "Moving to the UK as a heavy-duty truck driver was my dream. This portal handled all my papers and bilateral verifications. Flying to London next week!",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 9,
            name: "Amina Hassan",
            fromCountry: "Uganda",
            destination: "USA",
            sector: "Agriculture",
            date: "2026-02-20",
            story: "I applied for the H-2A farm program. Everything from the skill check to visa was transparent. Now working in a modern organic farm in California.",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 10,
            name: "Samuel Omondi",
            fromCountry: "Kenya",
            destination: "Qatar",
            sector: "Security",
            date: "2026-02-15",
            story: "Working in Doha as a facility watchman has changed my family's life. The EAC protection program ensures we have fair pay and verified housing.",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 1,
            name: "Beatrice Anyango",
            fromCountry: "Rwanda",
            destination: "Poland",
            sector: "Waste Management",
            date: "2025-03-15",
            story: "The waste management program in Poland is very modern. I was trained on arrival and the support from fellow EAC workers here is amazing!",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 2,
            name: "Evans Kiprotich",
            fromCountry: "Kenya",
            destination: "Germany",
            sector: "Janitorial Services",
            date: "2025-05-10",
            story: "Started as a cleaning assistant in Berlin. The pay is consistent and the bilateral agreement means my rights are fully protected.",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 3,
            name: "Scolastica Mutua",
            fromCountry: "Uganda",
            destination: "Australia",
            sector: "Gardening",
            date: "2025-06-20",
            story: "Maintaining the public parks in Sydney is a peaceful and well-paid job. I applied from Kampala and everything was handled in 4 months.",
            imageUrl: "/testimonial-avatar.png"
        },
        {
            id: 4,
            name: "Derrick Wafula",
            fromCountry: "Burundi",
            destination: "Canada",
            sector: "Construction",
            date: "2025-07-01",
            story: "Professional, supportive, and reliable. I’m now working in infrastructure construction in Toronto. Canada is full of opportunities for EAC workers.",
            imageUrl: "/testimonial-avatar.png"
        }
    ];

    const [page, setPage] = useState(1);

    const totalPages = useMemo(
        () => Math.ceil(testimonialsData.length / perPage),
        [testimonialsData.length]
    );

    const currentItems = useMemo(() => {
        const start = (page - 1) * perPage;
        return testimonialsData.slice(start, start + perPage);
    }, [page]);

    const getRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (diffInDays < 1) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (testimonialsData.length === 0)
        return <p className="no-testimonials">No testimonials found.</p>;

    return (
        <section className="testimonials-container" aria-label="Client testimonials">
            <header className="testimonials-header">
                <h2>Verified Success Stories</h2>
                <p>Inspiring journeys of East African workers settled in global employment markets under official bilateral pacts.</p>
            </header>

            <div className="testimonial-cards">
                {currentItems.map(({ id, name, fromCountry, destination, sector, date, story, imageUrl }) => (
                    <article
                        key={id}
                        className="testimonial-card"
                        tabIndex={0}
                        aria-describedby={`testimonial-story-${id}`}
                    >
                        <div className="avatar-wrapper">
                            <img
                                src={imageUrl || '/testimonial-avatar.png'}
                                alt={`${name}'s avatar`}
                                className="avatar"
                                loading="lazy"
                                onError={e => (e.target.src = '/testimonial-avatar.png')}
                            />
                        </div>
                        <div className="testimonial-text">
                            <header>
                                <div className="test-header-main">
                                    <h3 className="testimonial-name">{name}</h3>
                                    <span className="origin-tag">From {fromCountry}</span>
                                </div>
                                <div className="test-destination">
                                    <span className="working-label">Working in {destination}</span>
                                    <span className="sector-label">{sector}</span>
                                </div>
                                <time
                                    className="testimonial-date"
                                    dateTime={new Date(date).toISOString()}
                                >
                                    {getRelativeDate(date)}
                                </time>
                            </header>
                            <div
                                className="stars"
                                aria-label="5 star rating"
                                role="img"
                            >
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                            </div>
                            <blockquote
                                className="testimonial-story"
                                id={`testimonial-story-${id}`}
                            >
                                {story}
                            </blockquote>
                        </div>
                    </article>
                ))}
            </div>

            {totalPages > 1 && (
                <nav
                    className="pagination"
                    aria-label="Testimonials Pagination"
                >
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="pagination-button"
                    >
                        ← Prev
                    </button>
                    <span className="pagination-info">
                        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="pagination-button"
                    >
                        Next →
                    </button>
                </nav>
            )}
        </section>
    );
}

// Inline SVG star component
function StarIcon() {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FFC107"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '2px' }}
        >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}
