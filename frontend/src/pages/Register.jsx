import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../components/Toast';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Registration failed');
            }

            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            {/* LEFT PANEL */}
            <div className="auth-left" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }}>
                <div style={{ maxWidth: 400, color: 'white' }}>
                    <div style={{ fontSize: 40, marginBottom: 24 }}>🚀</div>
                    <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>
                        Start your journey today.
                    </h2>
                    <p style={{ fontSize: 16, opacity: 0.75, lineHeight: 1.7, marginBottom: 40 }}>
                        Join thousands of job seekers who've used ResumeAI to land their dream roles at top companies.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {['Free to get started', 'No credit card required', 'Unlimited resume previews', 'PDF download in seconds'].map(f => (
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
                        <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Free forever. No credit card needed.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleRegister}>
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
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Repeat your password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '13px', fontSize: 15, background: 'var(--green-600)' }}
                            disabled={loading}
                        >
                            {loading ? <><span className="spinner" /> Creating account...</> : 'Create free account →'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
