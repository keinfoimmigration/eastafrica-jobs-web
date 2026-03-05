import { useState, useMemo } from 'react';
import './Testimonials.css';

export default function Testimonials() {
    const perPage = 4;

    // ✅ Dummy testimonials data
    const testimonialsData = [
        {
            id: 7,
            name: "David Kimani",
            date: "2026-03-04",
            story: "Just received my visa approval today! The level of professionalism and support from this team is unmatched. I'll be flying to Hamburg next month!",
            imageUrl: ""
        },
        {
            id: 8,
            name: "Sarah Wangari",
            date: "2026-03-02",
            story: "The interview prep was the key for me. I felt so confident during my interview with the German employer. I'm officially a tech lead in Stuttgart now!",
            imageUrl: ""
        },
        {
            id: 9,
            name: "Kelvin Mutua",
            date: "2026-02-28",
            story: "I was skeptical at first, but every step was transparent. From data submission to job offer, it took less than 4 months. Highly recommended for everyone.",
            imageUrl: ""
        },
        {
            id: 10,
            name: "Lydia Moraa",
            date: "2026-02-26",
            story: "Moving to Germany as a nurse seemed like a mountain, but this community made it a smooth walk. I'm now settled in Berlin and loving the city!",
            imageUrl: ""
        },
        {
            id: 1,
            name: "John Mwangi",
            date: "2025-03-15",
            story: "Thanks to this program, I secured a nursing job in Berlin within 6 months. The support throughout the visa process was incredible!",
            imageUrl: ""
        },
        {
            id: 2,
            name: "Grace Achieng",
            date: "2025-05-10",
            story: "I never thought working in Germany was possible until I joined this community. Now I’m happily employed in Munich!",
            imageUrl: ""
        },
        {
            id: 3,
            name: "Peter Otieno",
            date: "2025-06-20",
            story: "The guidance on documentation and interview preparation made all the difference. Highly recommend!",
            imageUrl: ""
        },
        {
            id: 4,
            name: "Faith Wanjiru",
            date: "2025-07-01",
            story: "Professional, supportive, and reliable. I’m now working in Frankfurt and living my dream.",
            imageUrl: ""
        },
        {
            id: 5,
            name: "Brian Kiptoo",
            date: "2024-08-12",
            story: "Clear process, step-by-step assistance, and amazing mentorship. Germany is now my second home!",
            imageUrl: ""
        },
        {
            id: 6,
            name: "Esther Njeri",
            date: "2024-09-05",
            story: "From language training to job placement, everything was handled professionally. Thank you!",
            imageUrl: ""
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
                <h2>Success Stories from Our Community</h2>
                <p>Read inspiring stories from Kenyans who successfully landed jobs in Germany</p>
            </header>

            <div className="testimonial-cards">
                {currentItems.map(({ id, name, date, story, imageUrl }) => (
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
                                <h3 className="testimonial-name">{name}</h3>
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
