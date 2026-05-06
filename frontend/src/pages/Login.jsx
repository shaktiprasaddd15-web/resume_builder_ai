import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../components/Toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch('http://127.0.0.1:8000/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Login failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userEmail', data.username || email);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            {/* LEFT PANEL */}
            <div className="auth-left">
                <div style={{ maxWidth: 400, color: 'white' }}>
                    <div style={{ fontSize: 40, marginBottom: 24 }}>📄</div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>
                        Your career starts here.
                    </h2>
                    <p style={{ fontSize: 16, opacity: 0.75, lineHeight: 1.7, marginBottom: 40 }}>
                        Build a professional resume in minutes with the power of AI. Stand out from the crowd and land more interviews.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {['AI-powered content generation', 'ATS-optimized templates', 'Instant PDF download', 'Resume history & management'].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15 }}>
                                <span style={{ color: '#86efac', fontSize: 18 }}>✓</span>
                                <span style={{ opacity: 0.9 }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>👋</div>
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your ResumeAI account</p>
                    </div>

                    <div className="auth-social-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => toast.info('Google Auth is coming soon!')}>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                            Google
                        </button>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => toast.info('LinkedIn Auth is coming soon!')}>
                            <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" style={{ width: '18px', height: '18px' }} />
                            LinkedIn
                        </button>
                    </div>

                    <div className="auth-divider">
                        <span>or continue with email</span>
                    </div>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '13px', fontSize: 15 }}
                            disabled={loading}
                        >
                            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign in →'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Don't have an account?{' '}
                        <Link to="/register">Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
