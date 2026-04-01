import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, EyeOff, Lock, Zap, MessageSquare, AlertTriangle, PhoneCall, Bell, Fingerprint } from 'lucide-react';

export default function Home() {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [authMode, setAuthMode] = useState('signin'); // signin | signup
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            setMessage('Network error');
        }
        setLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setMessage(data.error || 'Signup failed');
            }
        } catch (err) {
            setMessage('Network error');
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            {/* HERO SECTION */}
            <section className="landing-section text-center" style={{ paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)', filter: 'drop-shadow(0 0 25px rgba(255, 51, 102, 0.6))' }}>
                    <ShieldCheck size={72} strokeWidth={1.2} />
                </div>
                <h1 style={{ marginBottom: '1rem' }}>CarSafe</h1>
                <p className="hero-tagline">
                    Emergency help for your car, accessible with a simple scan.
                </p>

                {/* LOGIN / SIGNUP CARD */}
                <div className="login-card-polished fade-scale-in">
                    {/* TABS */}
                    <div className="tab-group">
                        <button
                            type="button"
                            onClick={() => { setAuthMode('signin'); setMessage(''); }}
                            className={`tab-btn ${authMode === 'signin' ? 'active' : ''}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthMode('signup'); setMessage(''); }}
                            className={`tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {authMode === 'signin' ? 'Welcome back' : 'Create Account'}
                    </h2>
                    <p className="text-muted text-sm mb-6">
                        {authMode === 'signin' ? 'Log in to manage your QR.' : 'Sign up to generate your emergency QR.'}
                    </p>

                    {message && (
                        <div style={{ padding: '1rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={authMode === 'signin' ? handleLogin : handleSignup} style={{ textAlign: 'left' }}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder={authMode === 'signin' ? "••••••••" : "Create password"}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {authMode === 'signup' && (
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <button className="btn btn-primary w-full mt-4" disabled={loading}>
                            {loading ? (authMode === 'signin' ? 'Signing In...' : 'Creating Account...') : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>

                        {authMode === 'signin' && (
                            <div className="text-center mt-6">
                                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Forgot password?</a>
                            </div>
                        )}
                    </form>
                </div>

                {/* TRUST INDICATORS */}
                <div className="trust-indicators">
                    <div className="trust-item"><Smartphone size={16} color="var(--secondary)" /> Works with any phone</div>
                    <div className="trust-item"><EyeOff size={16} color="var(--primary)" /> No public profile</div>
                    <div className="trust-item"><Zap size={16} color="var(--accent)" /> Instant access</div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="landing-section">
                <h3 className="text-center mb-6" style={{ fontSize: '2rem' }}>How it works</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <div>
                            <strong style={{ color: 'white', display: 'block', marginBottom: '0.25rem' }}>Generate your QR</strong>
                            <p className="text-muted text-sm">Log in once and create a unique secure QR code for your car.</p>
                        </div>
                    </div>
                    
                    <div style={{ paddingLeft: '24px', borderLeft: '2px dashed rgba(255,255,255,0.15)', height: '2rem', width: '2px', marginLeft: '14px' }}></div>

                    <div className="step-card">
                        <span className="step-number">2</span>
                        <div>
                            <strong style={{ color: 'white', display: 'block', marginBottom: '0.25rem' }}>Place it on your car</strong>
                            <p className="text-muted text-sm">Attach or stick it where it is easily visible from the outside.</p>
                        </div>
                    </div>

                    <div style={{ paddingLeft: '24px', borderLeft: '2px dashed rgba(255,255,255,0.15)', height: '2rem', width: '2px', marginLeft: '14px' }}></div>

                    <div className="step-card" style={{ borderColor: 'var(--primary)', background: 'rgba(255,51,102,0.05)' }}>
                        <span className="step-number">3</span>
                        <div>
                            <strong style={{ color: 'white', display: 'block', marginBottom: '0.25rem' }}>Scan in an emergency</strong>
                            <p className="text-muted text-sm">Anyone can scan (police, passersby) to call your emergency contacts. <strong style={{ color: 'var(--primary)' }}>No app needed.</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* USE CASES */}
            <section className="landing-section">
                <h3 className="text-center mb-6" style={{ fontSize: '2rem' }}>Useful Scenarios</h3>
                <div className="feature-list">
                    <div className="feature-item">
                        <div style={{ background: 'rgba(255,51,102,0.1)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--primary)' }}><AlertTriangle size={28} /></div>
                        <div>
                            <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>After an Accident</strong>
                            <p className="text-sm text-muted">Quickly contact your family if you are unable to.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div style={{ background: 'rgba(0,210,255,0.1)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--secondary)' }}><PhoneCall size={28} /></div>
                        <div>
                            <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>In The Way</strong>
                            <p className="text-sm text-muted">If your car is blocking someone, they can alert you.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div style={{ background: 'rgba(255,153,0,0.1)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--accent)' }}><MessageSquare size={28} /></div>
                        <div>
                            <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Medical Issue</strong>
                            <p className="text-sm text-muted">Provides critical info if you have a medical emergency.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div style={{ background: 'rgba(0,230,118,0.1)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--success)' }}><Bell size={28} /></div>
                        <div>
                            <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Window Left Open</strong>
                            <p className="text-sm text-muted">Passersby can kindly notify you if a window is down or your alarm triggers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRIVACY */}
            <section className="landing-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem' }}>
                <h3 className="text-center mb-6" style={{ fontSize: '2rem' }}>Privacy First</h3>
                <div className="feature-list">
                    <div className="feature-item" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%' }}><Lock className="text-light" size={24} /></div>
                        <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>Only YOU can edit or deactivate your data.</span>
                    </div>
                    <div className="feature-item" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%' }}><EyeOff className="text-light" size={24} /></div>
                        <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>Helpers get read-only access to logic.</span>
                    </div>
                    <div className="feature-item" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%' }}><ShieldCheck className="text-light" size={24} /></div>
                        <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>No ads, no tracking, no data selling.</span>
                    </div>
                    <div className="feature-item" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%' }}><Fingerprint className="text-light" size={24} /></div>
                        <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>Unique IDs. Random URL identifiers prevent unauthorized scraping of your profile.</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ textAlign: 'center', padding: '3rem 0 1rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '3rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} CarSafe Project</p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Privacy</a>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Terms</a>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Contact</a>
                </div>
            </footer>
        </div>
    );
}
