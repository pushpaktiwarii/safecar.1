import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, Lock, Zap, MessageSquare, AlertTriangle, Fingerprint, ArrowRight } from 'lucide-react';

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
        <div className="animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* HER0 & AUTH (Bento Top) */}
            <div className="bento-grid" style={{ marginBottom: '1.5rem' }}>
                {/* Hero Box */}
                <div className="bento-card bento-hero">
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246,0.1)', borderRadius: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246,0.2)' }}>
                        <ShieldCheck size={48} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-1px' }}>
                        Secure Your Vehicle.
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6 }}>
                        The ultimate emergency contact system. Let rescuers reach you instantly without sharing your private phone number with the world.
                    </p>
                </div>

                {/* Auth Box */}
                <div className="bento-card bento-auth">
                    <div className="clean-tabs">
                        <button
                            type="button"
                            onClick={() => { setAuthMode('signin'); setMessage(''); }}
                            className={`clean-tab ${authMode === 'signin' ? 'active' : ''}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthMode('signup'); setMessage(''); }}
                            className={`clean-tab ${authMode === 'signup' ? 'active' : ''}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                        {authMode === 'signin' ? 'Welcome back' : 'Join Aidlyn'}
                    </h2>
                    <p className="text-muted text-sm mb-6">
                        {authMode === 'signin' ? 'Access your dashboard to manage your emergency profile.' : 'Get your print-ready QR sticker in seconds.'}
                    </p>

                    {message && (
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--primary)', borderRadius: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={authMode === 'signin' ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '500', paddingLeft: '0.2rem' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', color: 'var(--text-main)', background: 'var(--bg-color)', border: '1px solid var(--border)', width: '100%', borderRadius: '0.75rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '500', paddingLeft: '0.2rem' }}>Password</label>
                            <input
                                type="password"
                                placeholder={authMode === 'signin' ? "••••••••" : "Create a password"}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', color: 'var(--text-main)', background: 'var(--bg-color)', border: '1px solid var(--border)', width: '100%', borderRadius: '0.75rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {authMode === 'signup' && (
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '500', paddingLeft: '0.2rem' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', color: 'var(--text-main)', background: 'var(--bg-color)', border: '1px solid var(--border)', width: '100%', borderRadius: '0.75rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>
                        )}

                        <button className="btn btn-primary w-full mt-2" disabled={loading} style={{ padding: '1.15rem', borderRadius: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            {loading ? (authMode === 'signin' ? 'Authenticating...' : 'Registering...') : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            </div>

            {/* FEATURES (Bento Grid) */}
            <div className="bento-grid-3">
                <div className="bento-card bento-feature" style={{ background: 'linear-gradient(135deg, rgba(0,210,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                    <Smartphone size={32} color="var(--secondary)" className="mb-4" />
                    <h3>No App Required</h3>
                    <p className="text-muted text-sm mt-3 lh-lg">Anyone can scan your emergency sticker using their native phone camera. Instantly connects them to your secure dashboard.</p>
                </div>

                <div className="bento-card bento-feature" style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                    <MessageSquare size={32} color="var(--success)" className="mb-4" />
                    <h3>WhatsApp Ready</h3>
                    <p className="text-muted text-sm mt-3 lh-lg">Rescuers don't always want to call. We give them options to send a WhatsApp message directly to you with one tap.</p>
                </div>

                <div className="bento-card bento-feature" style={{ background: 'linear-gradient(135deg, rgba(255,153,0,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                    <Lock size={32} color="var(--accent)" className="mb-4" />
                    <h3>Total Privacy</h3>
                    <p className="text-muted text-sm mt-3 lh-lg">Hide or unhide your contact details anytime. Your actual phone number is never printed on the sticker itself.</p>
                </div>

                <div className="bento-card bento-span-2" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(59, 130, 246,0.1), rgba(0,210,255,0.05))', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <AlertTriangle size={36} color="var(--primary)" className="mb-4" />
                        <h3 style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Smart Incident Routing</h3>
                        <p className="text-muted mt-3" style={{ maxWidth: '500px', fontSize: '1.1rem', lineHeight: 1.6 }}>Our premium interface categorizes incidents (e.g. Accidents, Windows Left Open, Blocking the Way) before notifying you, so you know exactly what to expect before you arrive.</p>
                    </div>
                </div>

                <div className="bento-card bento-feature" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px dashed var(--border)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'} onClick={() => window.scrollTo(0, 0)}>
                    <div style={{ background: 'var(--border)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <Fingerprint size={32} color="var(--text-main)" />
                    </div>
                    <h3>Get Protected Now</h3>
                    <p className="text-muted text-sm mt-2 mb-0">Scroll up to generate your unique Aidlyn ID.</p>
                </div>
            </div>

            <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p>&copy; {new Date().getFullYear()} Aidlyn. Secured with modern cryptography.</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Crafted with precision by <strong>Prashant Maurya & Pushpak</strong></p>
            </footer>
        </div>
    );
}
