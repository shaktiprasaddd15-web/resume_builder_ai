import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const features = [
        {
            icon: '🤖',
            color: '#dbeafe',
            title: 'AI-Powered Writing',
            desc: 'Our AI analyzes your experience and generates compelling, keyword-rich bullet points that pass ATS filters.',
        },
        {
            icon: '🎨',
            color: '#ede9fe',
            title: '5 Premium Templates',
            desc: 'From creative to corporate — choose a design that fits your industry and personality.',
        },
        {
            icon: '⚡',
            color: '#d1fae5',
            title: 'Instant PDF Export',
            desc: 'Download a pixel-perfect PDF in seconds, ready to send to any recruiter.',
        },
        {
            icon: '🔒',
            color: '#fef3c7',
            title: 'ATS Optimized',
            desc: 'Every template is tested against top ATS systems to ensure your resume gets seen.',
        },
        {
            icon: '📊',
            color: '#fce7f3',
            title: 'Resume History',
            desc: 'Save and manage multiple versions of your resume for different job applications.',
        },
        {
            icon: '✏️',
            color: '#e0f2fe',
            title: 'Live Preview',
            desc: 'See exactly how your resume looks as you type — no surprises when you download.',
        },
    ];

    const templates = [
        { icon: '💼', name: 'Premium', desc: 'Two-column professional', bg: '#eff6ff' },
        { icon: '✨', name: 'Modern', desc: 'Clean & contemporary', bg: '#f0fdf4' },
        { icon: '🎨', name: 'Creative', desc: 'Bold sidebar design', bg: '#fdf4ff' },
        { icon: '🏢', name: 'Professional', desc: 'Classic corporate', bg: '#fff7ed' },
        { icon: '📋', name: 'ATS Simple', desc: 'Machine-readable', bg: '#f8fafc' },
    ];

    const steps = [
        { n: '1', title: 'Fill Your Details', desc: 'Enter your work history, skills, and education into our guided form.' },
        { n: '2', title: 'Pick a Template', desc: 'Choose from 5 professionally designed templates for any industry.' },
        { n: '3', title: 'AI Enhances It', desc: 'Our AI rewrites and polishes your content for maximum impact.' },
        { n: '4', title: 'Download PDF', desc: 'Get a perfect PDF resume ready to send to employers.' },
    ];

    return (
        <div className="home-page">
            {/* HERO */}
            <section className="hero">
                <div className="hero-content fade-up">
                    <div className="hero-badge">
                        <span>🚀</span> AI-Powered Resume Builder
                    </div>
                    <h1 className="hero-title">
                        Build a Resume That<br />
                        <span>Gets You Hired</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create a stunning, ATS-friendly resume in minutes using our AI. No design skills needed — just fill in your details and let us do the rest.
                    </p>
                    <div className="hero-actions">
                        <button
                            className="btn btn-white btn-xl"
                            onClick={() => navigate(isLoggedIn ? '/builder' : '/register')}
                        >
                            Start Building Free →
                        </button>
                        <button
                            className="btn btn-white-outline btn-xl"
                            onClick={() => navigate('/about')}
                        >
                            See How It Works
                        </button>
                    </div>

                    <div className="hero-stats">
                        {[
                            { value: '10K+', label: 'Resumes Created' },
                            { value: '5', label: 'Premium Templates' },
                            { value: '98%', label: 'ATS Pass Rate' },
                            { value: 'Free', label: 'To Get Started' },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div className="hero-stat-value">{s.value}</div>
                                <div className="hero-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features-section">
                <div className="section-header">
                    <div className="section-tag">Why ResumeAI?</div>
                    <h2 className="section-title">Everything you need to land the job</h2>
                    <p className="section-subtitle">
                        We've built every feature with one goal in mind: getting you more interviews.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((f) => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TEMPLATES */}
            <section className="templates-section">
                <div className="templates-inner">
                    <div className="section-header">
                        <div className="section-tag">Templates</div>
                        <h2 className="section-title">Choose your perfect style</h2>
                        <p className="section-subtitle">
                            Every template is designed by professionals and tested for ATS compatibility.
                        </p>
                    </div>
                    <div className="templates-showcase">
                        {templates.map((t) => (
                            <div
                                key={t.name}
                                className="template-showcase-card"
                                onClick={() => navigate(isLoggedIn ? '/builder' : '/register')}
                            >
                                <div className="template-showcase-preview" style={{ background: t.bg }}>
                                    {t.icon}
                                </div>
                                <div className="template-showcase-info">
                                    <div className="template-showcase-name">{t.name}</div>
                                    <div className="template-showcase-desc">{t.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="steps-section">
                <div className="section-header">
                    <div className="section-tag">How It Works</div>
                    <h2 className="section-title">From blank page to hired in 4 steps</h2>
                </div>
                <div className="steps-grid">
                    {steps.map((s) => (
                        <div key={s.n} className="step">
                            <div className="step-number">{s.n}</div>
                            <h3 className="step-title">{s.title}</h3>
                            <p className="step-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2 className="cta-title">Ready to get hired?</h2>
                <p className="cta-subtitle">Join thousands of job seekers who've landed their dream roles.</p>
                <button
                    className="btn btn-white btn-xl"
                    onClick={() => navigate(isLoggedIn ? '/builder' : '/register')}
                >
                    Create My Resume Now →
                </button>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-links">
                    <span className="footer-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    <span className="footer-link" onClick={() => navigate('/builder')} style={{ cursor: 'pointer' }}>Builder</span>
                    <span className="footer-link" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About</span>
                    <span className="footer-link" onClick={() => navigate('/history')} style={{ cursor: 'pointer' }}>History</span>
                </div>
                <p>© {new Date().getFullYear()} ResumeAI. Built with ❤️ and AI.</p>
            </footer>
        </div>
    );
};

export default Home;
