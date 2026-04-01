import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, AlertTriangle, CheckCircle, ArrowLeft, Car, Bike, Truck, HelpCircle, HeartPulse, Siren, MessageCircle, ShieldAlert, Key, Wind, CircleDashed } from 'lucide-react';

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

    const handleIncidentReport = async (type = 'General Alert') => {
        try {
            // First record it in backend database quietly
            await fetch('/api/public/incident', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qr_id: id, type })
            });

            // Native "Easy Way": Trigger Phone's SMS App to all Emergency Contacts
            if (data?.emergency_contacts && data.emergency_contacts.length > 0) {
                // Extract and clean numbers
                const numbers = data.emergency_contacts
                    .map(c => typeof c === 'object' ? c.number : c)
                    .filter(num => num)
                    .map(num => num.replace(/[^\d+]/g, ''))
                    .join(',');
                
                if (numbers) {
                    const separator = navigator.userAgent.match(/iPad|iPhone|iPod/) ? '&' : '?';
                    const message = encodeURIComponent(`🚨 Aidlyn Alert:\nIssue: ${type}\n\nSomeone scanned your vehicle's QR sticker and reported this. Please check on your vehicle.`);
                    
                    // Opens the native Messages app pre-filled with numbers and text!
                    window.location.href = `sms:${numbers}${separator}body=${message}`;
                }
            }

            // Show Confirmation UI
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
        <div className="login-card-polished text-center" style={{ marginTop: '20vh', maxWidth: '400px', margin: '20vh auto', border: '1px solid rgba(59, 130, 246,0.3)', boxShadow: '0 0 50px rgba(59, 130, 246,0.2)' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(59, 130, 246,0.1)', padding: '1rem', borderRadius: '50%' }}>
                    <AlertTriangle size={56} />
                </div>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scan Invalid</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>{error}</p>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-color)' }}>
            {/* Authentic Top Bar */}
            <div style={{ width: '100%', padding: '1.25rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <ShieldAlert size={20} color="var(--primary)" />
                    <span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Secure Connect</span>
                </div>
                <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(0,230,118,0.1)', color: 'var(--success)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    VERIFIED
                </div>
            </div>

            <div className="clean-card" style={{ width: '100%', maxWidth: '480px', flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>

                {/* Profile Header */}
                <div className="text-center mb-6" style={{ position: 'relative' }}>
                    <div className="pulse-ring-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
                        <div className="pulse-ring"></div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(0,210,255,0.15), rgba(0,210,255,0.05))', border: '1px solid rgba(0,210,255,0.3)', padding: '1.25rem', borderRadius: '50%', color: 'var(--secondary)', position: 'relative', zIndex: 2, display: 'inline-flex' }}>
                            {(!data.vehicle_type || data.vehicle_type === 'Car') && <Car size={36} />}
                            {data.vehicle_type === 'Bike' && <Bike size={36} />}
                            {data.vehicle_type === 'Truck' && <Truck size={36} />}
                            {data.vehicle_type === 'Other' && <HelpCircle size={36} />}
                        </div>
                    </div>

                    <p className="text-muted" style={{ fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{data.vehicle_type || 'Vehicle'} Owner</p>
                    <h1 style={{ color: 'var(--text-main)', fontSize: '2rem', marginBottom: '1rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        {data.owner_name ? data.owner_name : 'Protected User'}
                    </h1>

                    {(data.city || data.blood_group) && (
                        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '0.25rem', gap: '0.25rem', alignItems: 'center' }}>
                            {data.city && (
                                <div style={{ padding: '0.35rem 1rem', fontSize: '0.85rem', color: 'var(--text-light)', borderRight: data.blood_group ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                    {data.city}
                                </div>
                            )}
                            {data.blood_group && (
                                <div style={{ padding: '0.35rem 1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <HeartPulse size={14} /> {data.blood_group}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* View Mode: Main Options */}
                {mode === 'view' && (
                    <div className="fade-scale-in" style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            className="clean-btn btn-primary-clean"
                            onClick={() => setMode('contact')}
                        >
                            <Phone size={24} />
                            <span>Contact Emergency / Family</span>
                        </button>

                        <button
                            className="clean-btn btn-danger-clean"
                            onClick={() => setMode('reportOptions')}
                        >
                            <AlertTriangle size={24} />
                            <span>Report an Incident</span>
                        </button>
                    </div>
                )}

                {/* Contact Mode: Phone & WhatsApp */}
                {mode === 'contact' && (
                    <div className="fade-scale-in" style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                            <button onClick={() => setMode('view')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ArrowLeft size={20} />
                            </button>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontWeight: '500' }}>Emergency Contacts</h3>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {data.emergency_contacts && data.emergency_contacts.map((contact, i) => {
                                const num = typeof contact === 'object' ? contact.number : contact;
                                const label = typeof contact === 'object' && contact.label ? contact.label : `Emergency Contact ${i + 1}`;
                                if (!num) return null;

                                // Clean number for whatsapp routing
                                const waNum = num.replace(/\D/g, '');

                                return (
                                    <div key={i} className="clean-contact-card">
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '0.25rem' }}>{label}</div>
                                            <div style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '600' }}>{num}</div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <a href={`tel:${num}`} className="clean-action-btn solid-call">
                                                <Phone size={18} /> Call
                                            </a>
                                            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer" className="clean-action-btn solid-whatsapp">
                                                <MessageCircle size={18} /> WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Report Options Mode: Categorized Incidents */}
                {mode === 'reportOptions' && (
                    <div className="fade-scale-in" style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                            <button onClick={() => setMode('view')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ArrowLeft size={20} />
                            </button>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontWeight: '500' }}>What happened?</h3>
                        </div>

                        <p className="text-muted text-sm mb-4">Select an option to instantly alert the owner.</p>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <button onClick={() => handleIncidentReport('Accident / Damage')} className="clean-list-btn">
                                <AlertTriangle size={20} color="var(--primary)" />
                                <span>Accident or Damage</span>
                            </button>
                            <button onClick={() => handleIncidentReport('Wrong Parking / Blocking')} className="clean-list-btn">
                                <CircleDashed size={20} color="var(--accent)" />
                                <span>Vehicle is Blocking the Way</span>
                            </button>
                            <button onClick={() => handleIncidentReport('Window Open / Lights On')} className="clean-list-btn">
                                <Wind size={20} color="var(--secondary)" />
                                <span>Window Open / Lights On</span>
                            </button>
                            <button onClick={() => handleIncidentReport('Keys Left Inside')} className="clean-list-btn">
                                <Key size={20} color="#A0A5AA" />
                                <span>Keys Left Inside</span>
                            </button>
                            <button onClick={() => handleIncidentReport('Other Urgent Issue')} className="clean-list-btn" style={{ justifyContent: 'center', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Other Urgent Issue</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* After Report Success */}
                {mode === 'incident' && (
                    <div className="fade-scale-in text-center" style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(0,230,118,0.1)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(0,230,118,0.3)' }}>
                            <CheckCircle size={48} color="var(--success)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Alert Sent!</h2>
                        <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '2.5rem' }}>The owner has been notified successfully. Please wait near the vehicle if possible.</p>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>Need Public Services?</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                <a href="tel:112" className="clean-emergency-btn">
                                    <Siren size={20} />
                                    <span>112</span>
                                </a>
                                <a href="tel:100" className="clean-emergency-btn">
                                    <ShieldAlert size={20} />
                                    <span>100</span>
                                </a>
                                <a href="tel:108" className="clean-emergency-btn">
                                    <HeartPulse size={20} />
                                    <span>108</span>
                                </a>
                            </div>
                        </div>

                        <button onClick={() => setMode('view')} className="clean-btn" style={{ marginTop: '2.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            Return to Options
                        </button>
                    </div>
                )}

            </div>

            <div style={{ padding: '1.5rem', opacity: 0.5, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center' }}>
                <div>Secured by Aidlyn</div>
                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8 }}>Built by Prashant Maurya & Pushpak</div>
            </div>
        </div>
    );
}
