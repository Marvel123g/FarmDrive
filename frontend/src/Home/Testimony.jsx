import React, {useState} from 'react'

export default function Testimony() {
    const testimonials = [
      {
        id: 1,
        name: "Esther Mwangi",
        role: "Smallholder Farmer, Kiambu",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        quote: "FarmDrive has transformed how I get my produce to market. I now earn 40% more because I can deliver directly to buyers without middlemen taking cuts. The drivers are always professional and arrive on time.",
        rating: 5,
        crop: "🍅 Fresh Tomatoes",
        achievement: "Increased profit by 40%"
      },
      {
        id: 2,
        name: "James Omondi",
        role: "Delivery Driver, Kisumu",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        quote: "Being a driver on FarmDrive has given me a steady income. I make up to ₦15,000 daily doing what I love - driving. The platform is easy to use and payments are always prompt after delivery.",
        rating: 5,
        crop: "🚚 Delivery Specialist",
        achievement: "₦450K+ earned this year"
      },
      {
        id: 3,
        name: "Grace Adeyemi",
        role: "Farm Cooperative Leader, Oyo",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        quote: "Our cooperative of 50+ farmers now uses FarmDrive exclusively. The bidding system ensures we get fair transport prices, and tracking gives us peace of mind. Best decision we made!",
        rating: 5,
        crop: "🌽 Maize & Cassava",
        achievement: "Serving 50+ farmers"
      },
      {
        id: 4,
        name: "Peter Njoroge",
        role: "Logistics Partner, Nakuru",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        quote: "I've been in logistics for 10 years, and FarmDrive is a game-changer. The KYC verification means I only work with trusted farmers, and the platform handles all the payment headaches.",
        rating: 4,
        crop: "🚛 Fleet Owner",
        achievement: "95% repeat customers"
      }
    ];

    const [activeTestimonial, setActiveTestimonial] = useState(0);
    // const [isHovered, setIsHovered] = useState(false);

    const nextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };
    
  return (
    <>
      <section className="testimonials-section" id='testimonies'>
        
        <div className="testimonials-container">
            <div className="section-header">
            <div className="section-badge">Success Stories</div>
            <h2>Trusted by Farmers & Drivers Across Africa</h2>
            <p>Join thousands who have transformed their agricultural logistics with FarmDrive</p>
            </div>

            {/* Featured Stats */}
            <div className="testimonial-stats">
            <div className="stat-card">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Deliveries Completed</div>
            </div>
            <div className="stat-card">
                <div className="stat-number">₦2.5B+</div>
                <div className="stat-label">Farmer Earnings</div>
            </div>
            </div>

            {/* Main Testimonial Carousel */}
            <div className="testimonial-carousel">
            <button className="carousel-nav prev" onClick={prevTestimonial}>
                ←
            </button>
            
            <div className="carousel-track">
                {testimonials.map((testimonial, index) => (
                <div 
                    key={testimonial.id}
                    className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                    style={{ display: index === activeTestimonial ? 'block' : 'none' }}
                >
                    <div className="card-inner">
                    <div className="testimonial-quote-mark">“</div>
                    
                    <div className="testimonial-content">
                        <div className="testimonial-image">
                        <img src={testimonial.image} alt={testimonial.name} />
                        <div className="image-overlay"></div>
                        </div>
                        
                        <div className="testimonial-text">
                        <p className="quote">"{testimonial.quote}"</p>
                        
                        <div className="testimonial-author">
                            <h4>{testimonial.name}</h4>
                            <p className="role">{testimonial.role}</p>
                        </div>
                        
                        <div className="testimonial-tags">
                            <span className="tag">
                            <span className="tag-icon">{testimonial.crop}</span>
                            {testimonial.crop}
                            </span>
                            <span className="tag achievement">
                            <span className="tag-icon">🏆</span>
                            {testimonial.achievement}
                            </span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            
            <button className="carousel-nav next" onClick={nextTestimonial}>
                →
            </button>
            </div>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
            {testimonials.map((_, index) => (
                <button
                key={index}
                className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
                />
            ))}
            </div>

            {/* Additional Testimonials Grid */}
            <div className="testimonials-grid">
            <div className="grid-header">
                <h3>More Success Stories</h3>
                <p>Real experiences from our community</p>
            </div>
            
            <div className="testimonial-cards">
                {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="mini-testimonial">
                    <div className="mini-quote">"</div>
                    <p className="mini-text">{testimonial.quote.substring(0, 100)}...</p>
                    <div className="mini-author">
                    <div className="mini-avatar">
                        <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                    <div className="mini-info">
                        <h4>{testimonial.name}</h4>
                        <p>{testimonial.role}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* CTA to Join */}
            <div className="testimonials-cta">
            <div className="cta-content">
                <h3>Ready to write your success story?</h3>
                <p>Join thousands of farmers and drivers already using FarmDrive</p>
                <a className="cta-button" href="#hero" >
                    Get Started Today →
                </a>
            </div>
            </div>
        </div>
        </section>
    </>
  )
}
