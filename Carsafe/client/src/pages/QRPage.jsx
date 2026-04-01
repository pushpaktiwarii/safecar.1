import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, AlertTriangle, CheckCircle, ArrowLeft, Car, HeartPulse, Siren } from 'lucide-react';

export default function QRPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('view'); // view | incident | contact

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/public/qr/${id}`);
            if (!res.ok) {
                const err = await res.json();
                setError(err.error || 'QR not found');
            } else {
                const d = await res.json();
                setData(d);
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    const handleIncidentReport = async () => {
        // Report incident
        try {
            await fetch('/api/public/incident', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qr_id: id })
            });
            setMode('incident');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ marginBottom: '1.5rem', width: '48px', height: '48px', borderWidth: '4px' }}></div>
            <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', letterSpacing: '2px', textTransform: 'uppercase' }}>Decrypting Secure Payload...</p>
        </div>
    );

    if (error) return (
        <div className="login-card-polished text-center" style={{ marginTop: '20vh', maxWidth: '400px', margin: '20vh auto', border: '1px solid rgba(255,51,102,0.3)', boxShadow: '0 0 50px rgba(255,51,102,0.2)' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,51,102,0.1)', padding: '1rem', borderRadius: '50%' }}>
                    <AlertTriangle size={56} />
                </div>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scan Invalid</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>{error}</p>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 1rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="login-card-polished" style={{ padding: '2.5rem 1.5rem', width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div className="text-center mb-6">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.2)', padding: '1rem', borderRadius: '1rem', color: 'var(--secondary)' }}>
                            <Car size={40} />
                        </div>
                    </div>
                    <h1 style={{ color: 'white', fontSize: '2.25rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #fff, #A0A5AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Emergency Access</h1>
                    <p className="text-muted text-sm" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Registered Vehicle Owner</p>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)', marginTop: '0.5rem', textShadow: '0 0 20px rgba(0,210,255,0.4)', fontFamily: 'var(--font-heading)' }}>
                        {data.owner_name ? data.owner_name : 'Unknown Owner'}
                    </div>
                    
                    {(data.city || data.blood_group) && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {data.city && (
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>📍</span> {data.city}
                                </div>
                            )}
                            {data.blood_group && (
                                <div style={{ background: 'rgba(255,51,102,0.05)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', color: 'var(--primary)', border: '1px solid rgba(255,51,102,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
                                    <HeartPulse size={16} /> {data.blood_group}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {mode === 'view' && (
                    <div className="fade-scale-in" style={{ marginTop: '2rem' }}>
                        <button
                            className="btn-large-action btn-green-gradient"
                            onClick={() => setMode('contact')}
                        >
                            <div className="icon-box">
                                <Phone size={32} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '0.5px' }}>Call Owner / Family</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Dial registered emergency numbers</div>
                            </div>
                        </button>

                        <button
                            className="btn-large-action btn-red-gradient"
                            onClick={handleIncidentReport}
                            style={{ marginTop: '1rem' }}
                        >
                            <div className="icon-box">
                                <AlertTriangle size={32} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '0.5px' }}>Report Incident</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Trigger instant owner notification</div>
                            </div>
                        </button>
                    </div>
                )}

                {mode === 'contact' && (
                    <div className="fade-scale-in text-center" style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => setMode('view')}
                            className="btn btn-secondary mb-6"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '999px' }}
                        >
                            <ArrowLeft size={18} /> Back to Options
                        </button>

                        <h3 className="mb-6" style={{ fontSize: '1.75rem' }}>Secured Contacts</h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {data.emergency_contacts && data.emergency_contacts.map((contact, i) => {
                                const num = typeof contact === 'object' ? contact.number : contact;
                                const label = typeof contact === 'object' && contact.label ? contact.label : `Emergency Contact ${i + 1}`;

                                if (!num) return null;

                                return (
                                    <a key={i} href={`tel:${num}`} className="btn-large-action btn-green-gradient" style={{ padding: '1.25rem', marginBottom: '0' }}>
                                        <div className="icon-box" style={{ width: '48px', height: '48px', padding: '10px' }}>
                                            <Phone size={24} />
                                        </div>
                                        <div style={{ marginLeft: '0.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>{num}</div>
                                        </div>
                                    </a>
                                );
                            })}
                            {(!data.emergency_contacts || data.emergency_contacts.length === 0) && (
                                <p className="text-muted" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', background: 'rgba(0,0,0,0.2)' }}>No contacts available for this vehicle.</p>
                            )}
                        </div>
                    </div>
                )}

                {mode === 'incident' && (
                    <div className="fade-scale-in" style={{ marginTop: '2rem' }}>
                        <div className="text-center mb-6">
                            <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 0 30px rgba(255,51,102,0.2)' }}>
                                <Siren size={40} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Owner Alerted!</h2>
                            <p className="text-muted text-sm">Do you also need public emergency services?</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <a href="tel:112" className="btn-large-action btn-red-gradient" style={{ gridColumn: '1 / -1', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>112</div>
                                <div style={{ fontSize: '1rem', opacity: 0.9, fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase' }}>National Emergency</div>
                            </a>

                            <a href="tel:100" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.5rem', height: 'auto', background: 'rgba(0,210,255,0.05)', borderColor: 'rgba(0,210,255,0.2)' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>100</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Police</span>
                            </a>

                            <a href="tel:108" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.5rem', height: 'auto', background: 'rgba(255,153,0,0.05)', borderColor: 'rgba(255,153,0,0.2)' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>108</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>Ambulance</span>
                            </a>
                        </div>

                        <button onClick={() => setMode('view')} className="btn btn-secondary w-full" style={{ border: 'none', background: 'transparent' }}>
                            End Session
                        </button>
                    </div>
                )}
            </div>

            <div className="text-center mt-8">
                <p className="text-muted text-xs" style={{ opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase' }}>Secured by CarSafe Guardian</p>
            </div>
        </div>
    );
}
